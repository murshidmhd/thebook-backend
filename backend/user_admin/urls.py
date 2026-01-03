from django.urls import path
from .views import UserManagementView, UserDetailManagementView


urlpatterns = [
    path("", UserManagementView.as_view()),
    path("<int:pk>/", UserDetailManagementView.as_view()),
]
