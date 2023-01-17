import datetime

from django.db import models
from rest_framework.exceptions import ValidationError

from studios.models import Studio


# Create your models here.
class Classes(models.Model):
    "status represent whether a class in on-going or canceled(True means on-going while False means cancelled)"
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=200)
    description = models.CharField(max_length=200, null=True, blank=True)
    coach = models.CharField(max_length=150, null=True, blank=True)
    keywords = models.TextField(max_length=500, null=True, blank=True)
    # default 0, changeable by admin user
    # can be avoided by putting this as read only field in admin.py
    capacity = models.PositiveIntegerField(default=0)
    start_time = models.DateTimeField(auto_now=False, blank=False)
    end_time = models.DateTimeField(auto_now=False, blank=False)
    status = models.BooleanField(default=True)
    end_recur_date_time = models.DateTimeField(auto_now=False)
    studio = models.ForeignKey(to=Studio, on_delete=models.CASCADE, related_name="classes",
                               null=False)

    def __str__(self):
        return f"{self.name} coached by {self.coach} " \
               f", capacity is {self.capacity} " \
               f", keywords of this class is {self.keywords}" \


    def clean(self):
        if self.start_time > self.end_time:
            raise ValidationError("End Time should not precedes StartTime")
        if self.end_time > self.end_recur_date_time:
            raise ValidationError("End Time should not precedes End Recurrence Time")

    def save(self, *arg, **kwargs):
        ClassesInstance.objects.filter(h_class=self).delete()

        starts = self.start_time
        ends = self.end_time
        super(Classes, self).save(*arg, **kwargs)
        while starts < self.end_recur_date_time:
            ClassesInstance.objects.create(h_class=self, status=self.status, start_time=starts,
                                           name=self.name, description=self.description,
                                           coach=self.coach, keywords=self.keywords,
                                           end_time=ends, capacity=self.capacity)
            starts += datetime.timedelta(days=7)
            ends += datetime.timedelta(days=7)


class ClassesInstance(models.Model):
    "status represent whether a class in on-going or canceled(True means on-going while False means cancelled)"
    id = models.AutoField(primary_key=True)
    h_class = models.ForeignKey(to=Classes, on_delete=models.CASCADE, related_name="instances",
                                null=False)
    name = models.CharField(max_length=200, default="")
    description = models.CharField(max_length=200, null=True, blank=True)
    coach = models.CharField(max_length=150, null=True, blank=True)
    keywords = models.TextField(max_length=500, null=True, blank=True)
    # default 0, changeable by admin user
    # can be avoided by putting this as read only field in admin.py
    capacity = models.PositiveIntegerField(default=0)
    curr_enrollment = models.PositiveIntegerField(default=0, null=True)
    start_time = models.DateTimeField(auto_now=False)
    end_time = models.DateTimeField(auto_now=False)
    status = models.BooleanField(default=True)


    def __str__(self):
        return str(self.h_class) + f", starts at {self.start_time} and ends at {self.end_time} with id {self.id} "
