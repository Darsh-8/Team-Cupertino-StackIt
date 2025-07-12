from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, \
    TokenRefreshView

from stackusers.views_api import RegisterAPIView, ProfileAPIView

urlpatterns = [
    # JWT endpoints
    path('token/', TokenObtainPairView.as_view(),
         name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(),
         name='token_refresh'),

    # User registration and profile APIs
    path('register/', RegisterAPIView.as_view(), name='register_api'),
    path('profile/', ProfileAPIView.as_view(), name='profile_api'),
]
