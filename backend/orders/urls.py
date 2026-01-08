from django.urls import path
from .views import (
    CreateOnlineOrderView,
    OrderCreateView,
    UserOrderDetailView,
    UserOrderView,
)


urlpatterns = [
    path("online_pay/", CreateOnlineOrderView.as_view()),
    path("create/", OrderCreateView.as_view(), name="order-create"),
    path("", UserOrderView.as_view()),
    path("<int:order_id>/", UserOrderDetailView.as_view()),
]
