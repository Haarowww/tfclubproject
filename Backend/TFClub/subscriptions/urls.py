from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from subscriptions.views import CreateSubscriptionView, EditSubscriptionView, ShowSubscriptionView, \
    CreateCardInfo, UpdateCardInfo, CreatePayment, ShowAllPayment, CancelSubscriptionView, UpdateSubscriptionView

app_names = 'subscriptions'

urlpatterns = [
    path('create/', CreateSubscriptionView.as_view()),
    path('edit/<int:pk>/', EditSubscriptionView.as_view()),
    path('show/', ShowSubscriptionView.as_view()),
    path('createcard/', CreateCardInfo.as_view()),
    path('updatecard/<int:pk>/', UpdateCardInfo.as_view()),
    path('payment/', CreatePayment.as_view()),
    path('history/', ShowAllPayment.as_view()),
    path('cancel/', CancelSubscriptionView.as_view()),
    path('update/', UpdateSubscriptionView.as_view()),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

]
