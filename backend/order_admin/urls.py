from django.urls import path
from .views import OrderManagementView

urlpatterns = [path("", OrderManagementView.as_view())]
