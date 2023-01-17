from django.urls import path
from accounts.views import SignUpView, EditView, LoginView, LogoutView, Showuser, Showdetail, BlacklistTokenUpdateView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)



app_names = 'accounts'

urlpatterns = [
    path('signup/', SignUpView.as_view()),
    path('login/', LoginView.as_view()),
    path('edit/<int:pk>/', EditView.as_view()),
    path('logout/', LogoutView.as_view()),
    path('show/', Showuser.as_view()),
    path('show/<int:pk>/', Showdetail.as_view()),
    path('logout/blacklist/', BlacklistTokenUpdateView.as_view(),
         name='blacklist'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
