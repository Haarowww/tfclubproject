from django.contrib import admin
from subscriptions.models import Subscription, SubscriptionPlan, SubscriptionPayment
# Register your models here.

admin.site.register(Subscription)
admin.site.register(SubscriptionPlan)
admin.site.register(SubscriptionPayment)
