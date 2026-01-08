from django.db import transaction
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from products.models import Order, OrderItem
from products.models import Cart, CartItem
from products.models import Product
from products.models import Address
from order_admin.serializer import OrderSerializer


class OrderCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        address_id = request.data.get("address_id")
        items = request.data.get("items")  # frontend items

        if not address_id or not items:
            return Response(
                {"error": "Address and items are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            with transaction.atomic():
                address = Address.objects.get(id=address_id, user=request.user)

                # 🔹 Get user's cart from DB
                cart = Cart.objects.get(user=request.user)
                cart_items_qs = CartItem.objects.filter(cart=cart)

                if not cart_items_qs.exists():
                    return Response(
                        {"error": "Cart is empty"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                print(cart_items_qs)

                order = Order.objects.create(
                    user=request.user,
                    address=address,
                    total_price=0,
                    status="Pending",
                )

                total = 0
                for item in items:
                    product = Product.objects.get(id=item["product_id"])
                    quantity = item["quantity"]

                    total += product.price * quantity

                    OrderItem.objects.create(
                        order=order,
                        product=product,
                        quantity=quantity,
                        price_at_purchase=product.price,
                    )

                order.total_price = total
                order.save()

                cart_items_qs.delete()

                return Response(
                    {
                        "message": "Order created successfully!",
                        "order_id": order.id,
                    },
                    status=status.HTTP_201_CREATED,
                )

        except Address.DoesNotExist:
            return Response(
                {"error": "Invalid address"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        except Cart.DoesNotExist:
            return Response(
                {"error": "Cart not found"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )


class CreateOnlineOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        address_id = request.data.get("address_id")
        items = request.data.get("items")

        if not address_id or not items:
            return Response(
                {"error": "Address and items are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            with transaction.atomic():
                address = Address.objects.get(id=address_id, user=request.user)

                cart = Cart.objects.get(user=request.user)
                cart_items_qs = CartItem.objects.filter(cart=cart)

                if not cart_items_qs.exists():
                    return Response(
                        {"error": "Cart is empty"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                order = Order.objects.create(
                    user=request.user,
                    address=address,
                    total_price=0,
                    status="Pending",
                    payment_method="ONLINE",
                    payment_status="PENDING",
                )

                total = 0
                for item in items:
                    product = Product.objects.get(id=item["product_id"])
                    quantity = item["quantity"]

                    total += product.price * quantity

                    OrderItem.objects.create(
                        order=order,
                        product=product,
                        quantity=quantity,
                        price_at_purchase=product.price,
                    )

                # 5️⃣ Save total
                order.total_price = total
                order.save()

                # ❌ DO NOT clear cart here

                return Response(
                    {
                        "message": "Online order created",
                        "order_id": order.id,
                    },
                    status=status.HTTP_201_CREATED,
                )

        except Address.DoesNotExist:
            return Response(
                {"error": "Invalid address"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        except Cart.DoesNotExist:
            return Response(
                {"error": "Cart not found"},
                status=status.HTTP_400_BAD_REQUEST,
            )


class UserOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        orders = Order.objects.filter(user=request.user)
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)


class UserOrderDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, order_id):
        try:
            order = Order.objects.get(id=order_id, user=request.user)
        except Order.DoesNotExist:
            return Response(
                {"detail": "Order not found"}, status=status.HTTP_404_NOT_FOUND
            )

        serializer = OrderSerializer(order)
        return Response(serializer.data)
