from django.db import models
from django.core.exceptions import ValidationError
from accounts.models import CustomUser
from django.db.models import CASCADE


# Create your models here.
class Subscription(models.Model):
    id = models.AutoField(primary_key=True)
    money = models.DecimalField(decimal_places=2, max_digits=9)
    type = models.CharField(default='day', max_length=10)

    def __str__(self):
        return f"${self.money} per {self.type}"

    def clean(self):
        if self.type not in ['day', 'week', 'month', 'year']:
            raise ValidationError("the type should be one of these value: day, "
                                  "week, month, year")
        if self.money < 0:
            raise ValidationError('money should be a positive number')


class SubscriptionPlan(models.Model):
    id = None
    owner = models.OneToOneField(to=CustomUser, on_delete=CASCADE, related_name="subscribe_user", primary_key=True)
    transaction_time = models.DateTimeField(auto_now=True)
    card_info = models.CharField(max_length=16, default="xxxxxxxxxxxxxxxx")


class SubscriptionPayment(models.Model):
    owner = models.ForeignKey(to=CustomUser, on_delete=CASCADE)
    subscription = models.ForeignKey(to=Subscription, on_delete=CASCADE)
    amount = models.DecimalField(decimal_places=2, max_digits=9)
    subscription_amount = models.IntegerField(default=0)
    transaction_time = models.DateTimeField(auto_now=False)
    card_info = models.CharField(max_length=16, default="xxxxxxxxxxxxxxxx")
