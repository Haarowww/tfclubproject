import datetime
from rest_framework import serializers

from classes.models import Classes, ClassesInstance
from rest_framework.serializers import ModelSerializer


class ClassSerializer(ModelSerializer):
    class Meta:
        model = Classes
        fields = ["id", "name", "description", "coach", "keywords", "capacity",
                  "start_time", "end_time", "status", "end_recur_date_time", "studio"]

    def validate(self, data):
        # Validate Start Time of a new class
        if "start_time" not in data:
            raise serializers.ValidationError("Start Time is required")
        else:
            pass

        # Validate End Time of a new class
        if "end_time" not in data:
            raise serializers.ValidationError("End Time is required")
        else:
            pass

        # Validate End recurrence time of a new class
        if "end_recur_date_time" not in data:
            raise serializers.ValidationError("End Recurrence Date is required")
        elif data["end_recur_date_time"] < data["end_time"]:
            raise serializers.ValidationError("End Recurrence Date cannot be later than end time")

        return data

    def create(self, validated_data):
        instance = Classes.objects.create(**validated_data)
        start_time = validated_data.pop("start_time") + datetime.timedelta(days=7)
        end_time = validated_data.pop("end_time") + datetime.timedelta(days=7)
        while start_time < validated_data["end_recur_date_time"]:
            try:
                Classes.objects.create(start_time=start_time, end_time=end_time, **validated_data)
                start_time += datetime.timedelta(days=7)
                end_time += datetime.timedelta(days=7)
            except Exception as e:
                return e
        return instance


class DeleteClassesSerializer(ModelSerializer):
    class Meta:
        model = Classes
        field = '__all__'


class ClassInstanceSerializer(ModelSerializer):
    class Meta:
        model = ClassesInstance
        fields = ["id", "name", "coach", "description", "keywords", "capacity",
                  "curr_enrollment", "start_time", "end_time", "status"]


class StudioClassSerializer(ModelSerializer):
    studio = serializers.IntegerField(allow_null=False, default=0)

    class Meta:
        model = ClassesInstance
        fields = ["studio"]

    def validate(self, data):
        if data["studio"] != "":
            return data
        else:
            raise serializers.ValidationError("Should Enter a Valid Studio ID")


class SignUpClassSerializer(ModelSerializer):
    class_id = serializers.IntegerField(default=0)
    future = serializers.BooleanField(default=False)

    class Meta:
        model = ClassesInstance
        fields = ["class_id", "future"]

    def validate(self, attrs):
        if attrs["class_id"] == "":
            raise serializers.ValidationError("A valid class id is required")

        for cl in ClassesInstance.objects.all():
            if cl.id == attrs["class_id"]:
                return attrs

        raise serializers.ValidationError("A valid class id is required")


class FilterClassSerializer(ModelSerializer):
    studio_id = serializers.IntegerField(allow_null=False, default=None)
    name = serializers.CharField(allow_null=True, default=None)
    coach = serializers.CharField(allow_null=True, default=None)
    starts = serializers.TimeField(allow_null=True, default=None)
    ends = serializers.TimeField(allow_null=True, default=None)
    start_date = serializers.DateField(allow_null=True, default=None)
    end_date = serializers.DateField(allow_null=True, default=None)


    class Meta:
        model = ClassesInstance
        fields = ["studio_id", "name", "coach", "start_date", "end_date", "starts", "ends"]

    def validate(self, attrs):
        if attrs["studio_id"] is None:
            raise serializers.ValidationError("Please provide a studio id")
        if not attrs['starts'] is None and not attrs["ends"] is None:
            if attrs["starts"] > attrs["ends"]:
                raise serializers.ValidationError("End Time cannot precede Start Time")
        if not attrs["start_date"] is None and not attrs["end_date"] is None:
            if attrs["start_date"] > attrs["end_date"]:
                raise serializers.ValidationError("End Date cannot precede Start Date")
        if attrs["starts"] is None or attrs["ends"] is None:
            pass
        else:
            if attrs["starts"] > attrs["ends"]:
                raise serializers.ValidationError("End Time cannot precede Start Time")

        return attrs

    def __int__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["name"].required = False
        self.fields["coach"].required = False
        self.fields["starts"].required = False
        self.fields["ends"].required = False
        self.fields["start_date"].required = False
        self.fields["end_date"].required = False
