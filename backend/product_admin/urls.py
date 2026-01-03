from django.urls import path
from .views import ProductManagement, Is_Staff_View

urlpatterns = [
    path("", ProductManagement.as_view()),
    path("health/", Is_Staff_View.as_view()),
]
