from django.urls import path
from .views import RegisterView, ProfileView, UserLogin, UserLogout
from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", UserLogin.as_view(), name="login"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("logout/", UserLogout.as_view(), name="logout"),
    path("profile/", ProfileView.as_view(), name="profile"),
]
