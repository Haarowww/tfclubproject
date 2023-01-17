from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password
from django.core.validators import validate_email, EmailValidator
from django.db import IntegrityError
from rest_framework.exceptions import ValidationError

from accounts.models import CustomUser
from rest_framework import serializers
from rest_framework.serializers import ModelSerializer, Serializer
import re


class UserSerializer(ModelSerializer):
    password = serializers.CharField(
        style={'input_type': 'password', }
    )
    class Meta:
        model = CustomUser
        fields = ['username', 'first_name', 'last_name', 'email', 'avatar', 'phone_number', 'classes', 'password']
        extra_kwargs = {'email': {'validators': [EmailValidator, ]},
                        'password': {'write_only': True},
                        }
        read_only_fields = ('username',)


    def validate_username(self, value):
        customer = self.context['request'].user
        if CustomUser.objects.exclude(pk=customer.pk).filter(username=value).exists():
            raise serializers.ValidationError({"username": "This username is already in use."})
        return value

    def email_validate(self, email):
        try:
            validate_email(email)
        except ValidationError:
            raise serializers.ValidationError("Enter a valid email address")
        return email

    def validate_phone_number(self, data):
        if data is None:
            return data
        if len(data) != 12:
            raise serializers.ValidationError("The phone has to be length of 12")

        format = "^\d{3}-\d{3}-\d{4}$"
        if not re.match(format, data):
            raise serializers.ValidationError("Phone number format should like xxx-xxx-xxxx")
        return data

    def validate_password(self, data):
        if 0 < len(data) < 8:
            raise serializers.ValidationError("This password is too short. It must contain at least 8 characters")
        return data

    def __init__(self, *args, **kwargs):

        super().__init__(*args, **kwargs)
        self.fields['email'].required = False
        self.fields['phone_number'].required = False
        self.fields['first_name'].required = False
        self.fields['last_name'].required = False
        self.fields['avatar'].required = False
        self.fields['classes'].required = False
        self.fields['password'].required = False



    def update(self, instance, validated_data):
        customer = self.context['request'].user

        if customer.pk != instance.pk:
            raise serializers.ValidationError({"You dont have permission for this user."})
        if 'avatar' not in validated_data:
            validated_data["avatar"] = None
        # if 'password' not in validated_data:
            # pass
            # validated_data['password'] = make_password(validated_data.get('password'))
        if 'email' not in validated_data:
            validated_data["email"] = customer.email
        if 'first_name' not in validated_data:
            validated_data['first_name'] = customer.first_name
        if 'last_name' not in validated_data:
            validated_data['last_name'] = customer.last_name
        if 'phone_number' not in validated_data:
            validated_data["phone_number"] = customer.phone_number
        instance.first_name = validated_data['first_name']
        instance.last_name = validated_data['last_name']
        instance.email = validated_data['email']
        instance.avatar = validated_data['avatar']
        instance.phone_number = validated_data['phone_number']
        try:
            instance.set_password(validated_data['password'])
        except KeyError:
            pass
        instance.save()

        return instance


class SignupSerializer(ModelSerializer):
    username = serializers.CharField(max_length=150, required=True)
    avatar = serializers.FileField(allow_null=True)
    class Meta:
        model = CustomUser
        fields = ['username', 'first_name', 'last_name', 'email', 'avatar', 'phone_number',
                  'password']
        read_only_fields = ('classes',)

    def email_validate(self, email):
        try:
            validate_email(email)
        except ValidationError:
            raise serializers.ValidationError("Enter a valid email address")
        return email

    def validate_username(self, value):
        if value == "":
            raise serializers.ValidationError("This field is required")
        else:
            customer = self.context['request'].user
            if CustomUser.objects.exclude(pk=customer.pk).filter(username=value).exists():
                raise serializers.ValidationError("This username is already in use.")
        return value

    def validate_phone_number(self, value):
        if value is None:
            return value
        phone_number = value
        if len(phone_number) != 12:
            raise serializers.ValidationError("The phone has to be length of 12")

        format = "^\d{3}-\d{3}-\d{4}$"
        if not re.match(format, phone_number):
            raise serializers.ValidationError("Phone number format should like xxx-xxx-xxxx")

        return value

    def validate_password(self, data):
        if data == "":
            raise serializers.ValidationError("This field is required")
        if 0 < len(data) < 8:
            raise serializers.ValidationError("This password is too short. It must contain at least 8 characters")
        return data


    def __init__(self, *args, **kwargs):

        super().__init__(*args, **kwargs)
        self.fields['email'].required = False
        self.fields['phone_number'].required = False
        self.fields['first_name'].required = False
        self.fields['last_name'].required = False

    def create(self, data):
        if 'avatar' not in data:
            data["avatar"] = None
        if 'email' not in data:
            data["email"] = ""
        if 'phone_number' not in data:
            data["phone_number"] = ""
        if 'first_name' not in data:
            data["first_name"] = ""
        if 'last_name' not in data:
            data["last_name"] = ""
        try:
            customer = CustomUser.objects.create(
                username=data["username"],
                password=data["password"],
                email=data['email'],
                phone_number=data['phone_number'],
                avatar=data["avatar"],
                first_name=data["first_name"],
                last_name=data["last_name"]
            )

            customer.set_password(data['password'])
            customer.save()
        except Exception as e:
            return e

        return customer


class LoginSerializer(ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username', 'password', 'id']
        read_only_fields = ('id', )
        extra_kwargs = {'username': {'validators': []},
                        }

    def validate(self, data):
        username = data['username']
        password = data['password']
        if password == "":
            raise serializers.ValidationError("This field is required")
        if username == "":
            raise serializers.ValidationError("This field is required")

        customer = authenticate(username=username, password=password)
        if customer is None:
            raise serializers.ValidationError("This customer did not sign up or password mismatch")

        data["customer"] = customer
        return data


class Show(ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username', 'first_name', 'last_name', 'email', 'avatar', 'phone_number', 'password', 'expiry_date',
                 'classes']
        read_only_fields = ('classes', 'expiry_date')

