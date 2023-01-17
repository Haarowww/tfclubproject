from datetime import datetime

from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.utils.translation import gettext_lazy as _
from .managers import CustomUserManager
from classes.models import ClassesInstance


# Create your models here.
def upload_to(instance, filename):
    return 'posts/{filename}'.format(filename=filename)


class CustomUser(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(_("username"), max_length=150, blank=True, unique=True)
    email = models.EmailField(_('email address'), max_length=200, blank=True)
    first_name = models.CharField(_("first name"), max_length=150, blank=True)
    last_name = models.CharField(_("last name"), max_length=150, blank=True)
    avatar = models.ImageField(null=True, upload_to=upload_to, default='posts/default.jpg')
    phone_number = models.CharField(max_length=12, null=True)
    classes = models.ManyToManyField(ClassesInstance, blank=True)
    expiry_date = models.DateTimeField(auto_now=False, null=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def has_perm(self, perm, obj=None):
        "Does the user have a specific permission?"
        # Simplest possible answer: Yes, always
        return True

    def __str__(self):
        return self.username
