from django.urls import path
from .views import CreateRazorpayOrderView, VerifyRazorpayPaymentView

urlpatterns = [
    path("razorpay/create/", CreateRazorpayOrderView.as_view()),
    path("razorpay/verify/", VerifyRazorpayPaymentView.as_view()),
]
