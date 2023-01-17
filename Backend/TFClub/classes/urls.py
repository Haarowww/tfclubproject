from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from classes.views import CreateClassesView, DeleteClassesView, ListClassesView, SignUpClassView, \
    DropClassView, ListCustomerClassView, FilterClassesView, ListClassesShowView, FilterShowView, SearchClassShowView

app_names = 'classes'

urlpatterns = [
    path('create/', CreateClassesView.as_view()),
    path('delete/<int:pk>/', DeleteClassesView.as_view()),
    path('list/', ListClassesView.as_view(), name="list_class_by_studio"),
    path('list_show/<data>', ListClassesShowView.as_view(), name="list_show"),
    path('signup/', SignUpClassView.as_view(), name="sign_up_class"),
    path('drop/', DropClassView.as_view(), name="drop_class"),
    path('list_my_classes/', ListCustomerClassView.as_view(), name="list_customer_class"),
    path('filter_classes/', FilterClassesView.as_view(), name='filter_class'),
    path('filter_show/<data>', FilterShowView.as_view(), name="filter_show"),
    path('search/', SearchClassShowView.as_view()),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
