from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Product
from .serializers import (
    ProductReadSerializer,
    ProductWriteSerializer,
    CartSerializer,
    WishListSerializer,
)
from rest_framework import status
from django.db.models import Q
from .pagination import ProductPagination
from .serializers import WishListSerializer
from .models import Wishlist, WishlistItem, CartItem, Cart
from rest_framework.permissions import IsAuthenticated
from order_admin.serializer import OrderSerializer
from .models import Address
from .serializers import AddressSerializer
from .models import Order
from django.db import transaction
from .models import Order, OrderItem


from django.db import transaction
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status


class ProductListView(APIView):
    def get(self, request):
        search = request.query_params.get("search")
        product_type = request.query_params.get("type")

        queryset = Product.objects.filter(is_active=True)
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) | Q(author__icontains=search)
            )
        if product_type:
            queryset = queryset.filter(type=product_type)

        paginator = ProductPagination()
        paginated_queryset = paginator.paginate_queryset(queryset, request)

        serializer = ProductReadSerializer(paginated_queryset, many=True)
        return paginator.get_paginated_response(serializer.data)

    def post(self, request):
        serialiser = ProductWriteSerializer(data=request.data)
        if serialiser.is_valid():
            serialiser.save()
            return Response(serialiser.data, status=status.HTTP_201_CREATED)
        return Response(serialiser.errors, status=status.HTTP_400_BAD_REQUEST)


class ProductDetailAPIView(APIView):
    def get(self, request, pk):
        products = Product.objects.get(id=pk)
        serializer = ProductReadSerializer(products)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CartView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            cart, _ = Cart.objects.get_or_create(user=request.user)
            serializer = CartSerializer(cart)
            return Response(serializer.data)
        except Exception:
            return Response({"detail": "Something went wrong"}, status=500)

    def post(self, request):
        product_id = request.data.get("product_id")

        cart, _ = Cart.objects.get_or_create(user=request.user)

        try:
            product = Product.objects.get(id=product_id)

        except Product.DoesNotExist:
            return Response(
                {"detail": "Product not found"}, status=status.HTTP_404_NOT_FOUND
            )
        item_exists = CartItem.objects.filter(cart=cart, product=product).exists()
        if item_exists:
            return Response(
                {"message": "item aldredy in cart"}, status=status.HTTP_400_BAD_REQUEST
            )

        CartItem.objects.create(cart=cart, product=product, quantity=1)
        return Response(
            {"message": "Item added to cart successfully"},
            status=status.HTTP_201_CREATED,
        )

    def delete(self, request):
        product_id = request.data.get("product_id")

        if not product_id:
            items_deleted = CartItem.objects.filter(cart__user=request.user).delete()

            return Response(
                {"message": "Cart cleared successfully!", "count": items_deleted},
                status=status.HTTP_200_OK,
            )

        item = CartItem.objects.filter(
            product_id=product_id, cart__user=request.user
        ).first()

        if not item:
            return Response(
                {"detail": "Item not found or not authorized"},
                status=status.HTTP_404_NOT_FOUND,
            )

        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def put(self, request):
        product_id = request.data.get("product_id")
        new_qty = request.data.get("quantity")
        try:
            cart = request.user.cart

            cart_item = CartItem.objects.get(cart=cart, product_id=product_id)

            cart_item.quantity = new_qty
            cart_item.save()
            return Response({"details": "quantity updated"}, status=status.HTTP_200_OK)
        except CartItem.DoesNotExist:
            return Response({"detail": "Item not found"}, status=404)


class WishListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # try:
        wishlist, _ = Wishlist.objects.get_or_create(user=request.user)
        serializer = WishListSerializer(wishlist)
        return Response(serializer.data)

    # except Exception:
    #     return Response({"detail": "somethings wrong "} , status=status.HTTP_400_BAD_REQUEST)

    def post(slef, request):
        product_id = request.data.get("product_id")

        wishlist, _ = Wishlist.objects.get_or_create(user=request.user)

        item = WishlistItem.objects.filter(
            wishlist=wishlist, product_id=product_id
        ).first()
        if item:
            item.delete()
            return Response(
                {"detail": "removed from wishlist"}, status=status.HTTP_200_OK
            )
        else:
            WishlistItem.objects.create(wishlist=wishlist, product_id=product_id)
            return Response(
                {"detail": "added to wishlist"}, status=status.HTTP_201_CREATED
            )


class AddressListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        addresses = Address.objects.filter(user=request.user)
        serializer = AddressSerializer(addresses, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = AddressSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


