from django.urls import path
from .views import (
    ProductListView,
    ProductDetailAPIView,
    CartView,
    WishListView,
    # OrderCreateView,
    AddressListView,
)


urlpatterns = [
    path("products/", ProductListView.as_view(), name="product_list"),
    path("products/<int:pk>", ProductDetailAPIView.as_view(), name="product_by_id"),
    path("cart/", CartView.as_view(), name="cart-detail"),
    path("wishlist/", WishListView.as_view(), name="wishlist"),
    # path("orders/create/", OrderCreateView.as_view(), name="order-create"),
    path("address/", AddressListView.as_view(), name="address"),
]
