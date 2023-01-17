from django.db import models
from django.db.models import CASCADE
from django.utils.translation import gettext_lazy as _
from django.core.exceptions import ValidationError
import re


# Create your models here.

def upload_to(instance, filename):
    return 'posts/{filename}'.format(filename=filename)

class Studio(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=150)
    address = models.CharField(max_length=200)
    longitude = models.FloatField(max_length=10)
    latitude = models.FloatField(max_length=10)
    postal_code = models.CharField(_('Postal Code'), max_length=10, blank=True)
    phone_number = models.CharField(_('Phone Number'), max_length=12)
    images = models.ImageField(null=True, blank=True, upload_to=upload_to, default='posts/default.jpg')
    type = models.CharField(max_length=50, blank=True)
    quantity = models.PositiveIntegerField(null=False, default=0)
    direction_link = models.URLField(null=True)
    def __str__(self):
        return str(self.id) + ":" + self.name

    def clean(self):
        if self.name == "":
            raise ValidationError("This field is needed")

        if self.address == "":
            raise ValidationError("This field is required")

        if self.phone_number == "":
            raise ValidationError("This field is required")
        elif len(self.phone_number) != 12:
            raise ValidationError("The phone has to be length of 12")
        else:
            format = "^\d{3}-\d{3}-\d{4}$"
            if not re.match(format, self.phone_number):
                raise ValidationError("Phone number format should like xxx-xxx-xxxx")

        if self.longitude == "":
            raise ValidationError("This field is required")
        elif float(self.longitude) > 180 or float(self.longitude) < -180:
            raise ValidationError("Enter a correct longitude value")

        if self.latitude == "":
            raise ValidationError("This field is required")
        elif float(self.latitude) > 90 or float(self.latitude) < -90:
            raise ValidationError("Enter a correct latitude value")

        formation = "^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$"
        if not re.match(formation, self.postal_code):
            raise ValidationError("Postal code format should like ANA NAN,"
                                  " where 'A' represents an alphabetic character"
                                  " and 'N' represents a numeric character")

    # def get_images(self):
    #     if self.images:
    #         return self.images.url
    #     else:
    #         return None


class Amenities(models.Model):
    studio = models.ForeignKey(to=Studio, on_delete=CASCADE)
    type = models.CharField(max_length=30)
    quantity = models.IntegerField()

    def __str__(self):
        return self.type

