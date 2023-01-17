import datetime

from rest_framework.response import Response
from accounts.models import CustomUser
from subscriptions.models import Subscription, SubscriptionPlan, SubscriptionPayment
from rest_framework import serializers
from rest_framework.serializers import ModelSerializer, Serializer
from django.utils import timezone


class SubscriptionSerializer(ModelSerializer):
    class Meta:
        model = Subscription
        fields = ['money', 'type']

    def validate_type(self, value):
        if value == "":
            raise serializers.ValidationError("This field is needed")
        else:
            if value not in ['day', 'week', 'month', 'year']:
                raise serializers.ValidationError("the type should be one of these value: day, "
                                                  "week, month, year")
        return value

    def validate_money(self, value):
        if value == "":
            raise serializers.ValidationError("This field is needed")
        else:
            if value < 0:
                raise serializers.ValidationError('money should be a positive number')
        return value


class ShowSubscriptionSerializer(ModelSerializer):
    class Meta:
        model = Subscription
        fields = '__all__'


class CardInfo(ModelSerializer):
    username = serializers.CharField(source="owner.username", read_only=True)

    class Meta:
        model = SubscriptionPlan
        fields = ['card_info', 'username']

    def validate_card_info(self, data):
        card_info = data
        if card_info == "":
            raise serializers.ValidationError("This field is required")
        if len(card_info) != 16:
            raise serializers.ValidationError("Card should has to be 16 digits")
        if not all(i in "1234567890" for i in card_info):
            raise serializers.ValidationError("Card has to be number 0 - 9")
        return data

    def create(self, validated_data):
        user = self.context["request"].user
        validated_data['user'] = user
        if 'card_info' not in validated_data:
            validated_data["card_info"] = ""
        if SubscriptionPlan.objects.filter(owner_id=user.id).exists():
            raise serializers.ValidationError("You have created an account, you can go to update now")
        try:
            card = SubscriptionPlan.objects.create(
                card_info=validated_data["card_info"],
                owner=user,
                owner_id=user.id
            )

        except Exception as e:
            return e

        return card


class UpdateCardInfoSerializer(ModelSerializer):
    username = serializers.CharField(source="owner.username", read_only=True)

    class Meta:
        model = SubscriptionPlan
        fields = ['card_info', 'username']

    def validate_card_info(self, data):
        card_info = data
        if card_info == "":
            raise serializers.ValidationError("This field is required")
        if len(card_info) != 16:
            raise serializers.ValidationError("Card should has to be 16 digits")
        if not all(i in "1234567890" for i in card_info):
            raise serializers.ValidationError("Card has to be number 0 - 9")
        return data

    def update(self, instance, validated_data):
        customer = self.context['request'].user
        if customer.pk != instance.owner_id:
            raise serializers.ValidationError({"You dont have permission for this user."})
        if 'card_info' not in validated_data:
            raise serializers.ValidationError("This field is required")

        instance.card_info = validated_data['card_info']
        instance.save()

        # After update the card info, the subsequent payment history will be updated.
        time = timezone.now()
        if SubscriptionPayment.objects.filter(owner=customer).exists():
            queryset = SubscriptionPayment.objects.filter(owner=customer).all()
            for item in queryset:
                if item.transaction_time > time:
                    item.card_info = validated_data['card_info']
                    item.save()

        return instance


class PaymentHistory(ModelSerializer):
    username = serializers.CharField(source="owner.username", read_only=True)

    class Meta:
        model = SubscriptionPayment
        fields = ['username', 'subscription', 'card_info', 'subscription_amount']
        read_only_fields = ('card_info',)

    # def validated_subscription_amount(self, value):
    #     if value == "":
    #         raise serializers.ValidationError("This field is required")
    #     return value

    def create(self, validated_data):
        user = self.context["request"].user
        card_info = ""
        if SubscriptionPlan.objects.filter(owner=user).exists():
            card_info = SubscriptionPlan.objects.get(owner=user).card_info
        else:
            card_info = "You should attach a payment card first"
            raise serializers.ValidationError(card_info)

        amount = validated_data['subscription'].money
        time = timezone.now()
        instance = SubscriptionPayment.objects.create(
                                                      subscription=validated_data['subscription'],
                                                      amount=amount,
                                                      subscription_amount=validated_data['subscription_amount'],
                                                      transaction_time=time,
                                                      owner_id=user.id,
                                                      card_info=card_info)
        type = validated_data['subscription'].type
        for i in range(1, validated_data['subscription_amount']):
            try:
                if type == 'day':
                    time += datetime.timedelta(days=1)
                elif type == 'week':
                    time += datetime.timedelta(days=7)
                elif type == 'month':
                    time += datetime.timedelta(days=30)
                else:
                    time += datetime.timedelta(days=365)
                SubscriptionPayment.objects.create(
                                                   subscription=validated_data['subscription'],
                                                   amount=amount,
                                                   subscription_amount=validated_data['subscription_amount'],
                                                   transaction_time=time,
                                                   owner_id=user.id,
                                                   card_info=card_info)
            except Exception as e:
                return e

        # For expiry date, after the last payment was successfully made, we need to add the time again.
        if type == 'day':
            time += datetime.timedelta(days=1)
        elif type == 'week':
            time += datetime.timedelta(days=7)
        elif type == 'month':
            time += datetime.timedelta(days=30)
        else:
            time += datetime.timedelta(days=365)
        CustomUser.objects.filter(id=user.id).update(expiry_date=time)
        return instance


class ShowPaymentHistory(ModelSerializer):
    class Meta:
        model = SubscriptionPayment
        fields = ['owner', 'amount', 'transaction_time', 'card_info']
