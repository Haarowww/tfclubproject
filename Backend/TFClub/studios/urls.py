from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from studios.views import CreateStudioView, EditStudioView, DeleteStudioView, NearestStudioView, PickStudioView,\
    FilterStudioView, FilterShowView, DistanceShowView, SearchShowView, ShowStudio

app_names = 'studios'

urlpatterns = [
    path('create/', CreateStudioView.as_view()),
    path('edit/<int:pk>/', EditStudioView.as_view()),
    path('delete/<int:pk>/', DeleteStudioView.as_view()),
    path('distance/', NearestStudioView.as_view()),
    path('show/', ShowStudio.as_view()),
    path('show/<int:pk>/', PickStudioView.as_view()),
    path('distance/<data>', DistanceShowView.as_view(), name="distance_show"),
    path('click/<int:pk>/', PickStudioView.as_view()),
    path('filter/', FilterStudioView.as_view()),
    path('filter_show/<data>', FilterShowView.as_view(), name='filter_show_studio'),
    path('search/', SearchShowView.as_view()),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]