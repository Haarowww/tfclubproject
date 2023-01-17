import re

from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password
from django.core.validators import validate_email, EmailValidator
from django.db import IntegrityError
from rest_framework.exceptions import ValidationError

from studios.models import Studio
from rest_framework import serializers
from rest_framework.serializers import ModelSerializer, Serializer


class StudioSerializer(ModelSerializer):
    class Meta:
        model = Studio
        fields = ['id', 'name', 'address', 'longitude', 'latitude', 'postal_code', 'phone_number',
                  'images', 'type', 'quantity']

    def validate_name(self, value):
        if value == "":
            raise serializers.ValidationError("This field is needed")
        return value

    def validate_address(self, value):
        if value == "":
            raise serializers.ValidationError("This field is required")
        return value

    def validate_phone_number(self, value):
        if value == "":
            raise serializers.ValidationError("This field is required")
        elif len(value) != 12:
            raise serializers.ValidationError("The phone has to be length of 12")
        else:
            format = "^\d{3}-\d{3}-\d{4}$"
            if not re.match(format, value):
                raise serializers.ValidationError("Phone number format should like xxx-xxx-xxxx")

        return value

    def validate_longitude(self, value):
        if value == "":
            raise serializers.ValidationError("This field is required")
        elif float(value) > 180 or float(value) < -180:
            raise serializers.ValidationError("Enter a correct longitude value")
        return value

    def validate_latitude(self, value):
        if value == "":
            raise serializers.ValidationError("This field is required")
        elif float(value) > 90 or float(value) < -90:
            raise serializers.ValidationError("Enter a correct latitude value")
        return value

    def validate_postal_code(self, value):
        format = "^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$"
        if not re.match(format, value):
            raise serializers.ValidationError("Postal code format should like ANA NAN,"
                                              " where 'A' represents an alphabetic character"
                                              " and 'N' represents a numeric character")
        return value

    # def validate_geographical_location(self, value):
    #     if value == "":
    #         raise serializers.ValidationError('This field may not be blank.')
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['postal_code'].required = False
        self.fields['images'].required = False
        self.fields['type'].required = False
        self.fields['quantity'].required = False


class DeleteStudioSerializer(ModelSerializer):
    class Meta:
        model = Studio
        field = '__all__'


class UserNearestStudio(ModelSerializer):

    class Meta:
        model = Studio
        fields = ['longitude', 'latitude', 'direction_link']

    def validate(self, data):
        longitude = data['longitude']
        latitude = data['latitude']
        if longitude == "":
            raise serializers.ValidationError("This field is required")
        elif float(longitude) > 180 or float(longitude) < -180:
            raise serializers.ValidationError("Enter a correct longitude value")
        if latitude == "":
            raise serializers.ValidationError("This field is required")
        elif float(latitude) > 90 or float(latitude) < -90:
            raise serializers.ValidationError("Enter a correct latitude value")

        return data


class PickStudio(ModelSerializer):

    class Meta:
        model = Studio
        fields = ['id', 'name', 'address', 'longitude', 'latitude', 'postal_code', 'phone_number',
                'images', 'type', 'quantity', 'direction_link']


class FilterStudio(ModelSerializer):
    class_name = serializers.CharField(max_length=200, allow_null=True)
    coach_name = serializers.CharField(max_length=150, allow_null=True)

    class Meta:
        model = Studio
        fields = ['name', 'type', 'quantity', 'coach_name', 'class_name']


    def validate_name(self, value):
        if value == "":
            raise serializers.ValidationError("This field is needed")
        return value

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['name'].required = False
        self.fields['type'].required = False
        self.fields['quantity'].required = False
        self.fields['coach_name'].required = False
        self.fields['class_name'].required = False
