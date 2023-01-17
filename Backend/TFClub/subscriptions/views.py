import datetime

from django.shortcuts import render
from rest_framework import status
from rest_framework.generics import CreateAPIView, RetrieveUpdateAPIView, DestroyAPIView, UpdateAPIView, ListAPIView
from accounts.models import CustomUser
from subscriptions.serializers import SubscriptionSerializer, ShowSubscriptionSerializer, CardInfo, \
    UpdateCardInfoSerializer, PaymentHistory, ShowPaymentHistory
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from math import *
from django.utils import timezone
from subscriptions.models import Subscription, SubscriptionPlan, SubscriptionPayment


# Create your views here.
class CreateSubscriptionView(CreateAPIView):
    # permission_classes = [IsAuthenticated, ]
    serializer_class = SubscriptionSerializer


class EditSubscriptionView(RetrieveUpdateAPIView):
    # permission_classes = [IsAuthenticated, ]
    serializer_class = SubscriptionSerializer
    queryset = Subscription.objects.all()


class ShowSubscriptionView(ListAPIView):
    # permission_classes = [IsAuthenticated, ]
    serializer_class = ShowSubscriptionSerializer
    queryset = Subscription.objects.all()


class CreateCardInfo(CreateAPIView):
    serializer_class = CardInfo
    queryset = SubscriptionPlan.objects.all()
    permission_classes = (IsAuthenticated,)

    # def post(self, request, *args, **kwargs):
    #     customer = self.get_serializer(data=request.data)
    #     customer.is_valid(raise_exception=True)
    #     customer.save()
    #
    #     return Response(customer.data)


class UpdateCardInfo(UpdateAPIView):
    serializer_class = UpdateCardInfoSerializer
    queryset = SubscriptionPlan.objects.all()
    permission_classes = (IsAuthenticated,)


class CreatePayment(CreateAPIView):
    serializer_class = PaymentHistory
    queryset = SubscriptionPlan.objects.all()
    permission_classes = (IsAuthenticated,)


class ShowAllPayment(ListAPIView):
    # permission_classes = (IsAuthenticated,)
    serializer_class = ShowPaymentHistory

    def get_queryset(self):
        user = self.request.user
        queryset = SubscriptionPayment.objects.filter(owner_id=user.id).all()
        return queryset


class CancelSubscriptionView(CreateAPIView):
    serializer_class = PaymentHistory
    model = SubscriptionPayment
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        queryset = SubscriptionPayment.objects.filter(owner=user).all()
        return queryset

    def post(self, request, *args, **kwargs):
        user = self.request.user
        queryset = self.get_queryset()

        time = timezone.now()
        if user.expiry_date < time:
            return Response('You did not subscribe any plan!')
        # next, delete the user's future payment
        for item in queryset.values():
            # we will cancel its future payment
            if item['transaction_time'] > time:
                SubscriptionPayment.objects.filter(transaction_time=item['transaction_time']).delete()

        # then, according to user's current latest transfer time, we will update user's expiry date.
        # for type 1, expiry date no change.
        current_latest = SubscriptionPayment.objects.filter(owner=user).order_by('-transaction_time')[0]
        expiry_time = current_latest.transaction_time
        type = current_latest.subscription.type
        if type == 'day':
            expiry_time += datetime.timedelta(days=1)
        elif type == 'week':
            expiry_time += datetime.timedelta(days=7)
        elif type == 'month':
            expiry_time += datetime.timedelta(days=30)
        else:
            expiry_time += datetime.timedelta(days=365)
        CustomUser.objects.filter(username=user.username).update(expiry_date=expiry_time)

        # finally, we can remove invalid class.
        for klass in user.classes.all():
            if (klass.start_time <= expiry_time < klass.end_time) or (expiry_time < klass.start_time):
                user.classes.remove(klass)
                user.save()

        return Response(f"You have cancelled your subscription, {user.username}")


class UpdateSubscriptionView(CreateAPIView):
    serializer_class = PaymentHistory
    model = SubscriptionPayment
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        queryset = SubscriptionPayment.objects.filter(owner=user).all()
        return queryset

    def post(self, request, *args, **kwargs):
        user = self.request.user
        queryset = self.get_queryset()

        time = timezone.now()

        # in order to face the case that user may edit the type of subscription, we can
        # remove the future payment and then generate new future payment
        for item in queryset.values():
            # we will cancel its future payment
            if item['transaction_time'] > time:
                SubscriptionPayment.objects.filter(transaction_time=item['transaction_time']).delete()

        # then generate new future payment
        return self.create(request)
