from django.contrib.auth import login, logout
from django.contrib.auth.models import update_last_login
from django.http import JsonResponse
from django.shortcuts import render
from rest_framework import status
from rest_framework.generics import CreateAPIView, RetrieveUpdateAPIView, ListAPIView, RetrieveAPIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.serializers import UserSerializer, SignupSerializer, LoginSerializer, Show
from rest_framework_simplejwt.tokens import RefreshToken
from .models import CustomUser
from subscriptions.models import SubscriptionPlan


# Create your views here.


class EditView(RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    queryset = CustomUser.objects.all()
    # queryset.get().is_valid(raise_exception=True)
    permission_classes = (IsAuthenticated,)
    parser_classes = [MultiPartParser, FormParser]


    # def get_object(self):


class SignUpView(CreateAPIView):
    serializer_class = SignupSerializer
    # permission_classes = [AllowAny]


    # def post(self, request, *args, **kwargs):
    #     customer = self.get_serializer(data=request.data)
    #     customer.is_valid(raise_exception=True)
    #     customer.save()
    #     response = "Successfully signup"
    #     return Response(response)


class LoginView(CreateAPIView):
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):

        customer = self.get_serializer(data=self.request.data)
        customer.is_valid(raise_exception=True)
        login(request, customer.validated_data['customer'])
        queryset = CustomUser.objects.get(username=customer.data['username'])

        return Response(queryset.id)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated, ]

    def get(self, request):
        logout(request)
        return Response('Successfully logout')


class Showuser(ListAPIView):
    serializer_class = Show
    queryset = CustomUser.objects.all()


class Showdetail(RetrieveAPIView):
    serializer_class = Show
    # queryset = CustomUser.objects.all()

    def get(self, request, pk):
        if not CustomUser.objects.filter(id=pk).exists():
            return Response('User not exist', status=404)
        else:
            user = CustomUser.objects.get(id=pk)
            if SubscriptionPlan.objects.filter(owner=pk):
                card = SubscriptionPlan.objects.get(owner=pk)
            # return Response(card)
                if user.avatar:
                    data = {'username': user.username,
                            'email': user.email,
                            'first_name': user.first_name,
                            'last_name': user.last_name,
                            'classes': user.classes.values(),
                            'phone_number': user.phone_number,
                            'expiry_date': user.expiry_date,
                            'avatar': user.avatar.url,
                            "card_info": card.card_info
                            }
                else:
                    data = {'username': user.username,
                            'email': user.email,
                            'first_name': user.first_name,
                            'last_name': user.last_name,
                            'classes': user.classes.values(),
                            'phone_number': user.phone_number,
                            'expiry_date': user.expiry_date,
                            "card_info": card.card_info,
                            "avatar": ""
                            }
            else:
                if user.avatar:

                    data = {'username': user.username,
                            'email': user.email,
                            'first_name': user.first_name,
                            'last_name': user.last_name,
                            'classes': user.classes.values(),
                            'phone_number': user.phone_number,
                            'expiry_date': user.expiry_date,
                            'avatar': user.avatar.url,
                            }
                else:
                    data = {'username': user.username,
                            'email': user.email,
                            'first_name': user.first_name,
                            'last_name': user.last_name,
                            'classes': user.classes.values(),
                            'phone_number': user.phone_number,
                            'expiry_date': user.expiry_date,
                            "avatar": ""
                            }


            return Response(data)


class BlacklistTokenUpdateView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = ()

    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)


