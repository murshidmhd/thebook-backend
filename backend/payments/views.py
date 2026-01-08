import razorpay
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from products.models import Order
import hmac
import hashlib

from django.db import transaction
from products.models import Order, OrderItem
from products.models import Cart, CartItem
from products.models import Product
from products.models import Address


class CreateRazorpayOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        order_id = request.data.get("order_id")
        print(order_id)

        try:
            order = Order.objects.get(id=order_id, user=request.user)
            print(order)

            client = razorpay.Client(
                auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
            )

            razorpay_order = client.order.create(
                {
                    "amount": int(order.total_price * 100),  # paise
                    "currency": "INR",
                    "receipt": f"order_{order.id}",
                }
            )

            return Response(
                {
                    "razorpay_order_id": razorpay_order["id"],
                    "razorpay_key": settings.RAZORPAY_KEY_ID,
                    "amount": razorpay_order["amount"],
                }
            )

        except Order.DoesNotExist:
            return Response(
                {"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND
            )


from products.models import Cart, CartItem

class VerifyRazorpayPaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data

        order_id = data.get("order_id")
        razorpay_order_id = data.get("razorpay_order_id")
        razorpay_payment_id = data.get("razorpay_payment_id")
        razorpay_signature = data.get("razorpay_signature")

        body = f"{razorpay_order_id}|{razorpay_payment_id}"

        expected_signature = hmac.new(
            settings.RAZORPAY_KEY_SECRET.encode(),
            body.encode(),
            hashlib.sha256
        ).hexdigest()

        if expected_signature != razorpay_signature:
            return Response(
                {"error": "Payment verification failed"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        order = Order.objects.get(id=order_id, user=request.user)
        order.status = "Paid"
        order.payment_status = "PAID"
        order.save()

        # ✅ CLEAR CART HERE (BACKEND SOURCE OF TRUTH)
        cart = Cart.objects.get(user=request.user)
        CartItem.objects.filter(cart=cart).delete()

        return Response({"message": "Payment verified successfully"})


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
                # 1️⃣ Validate address ownership
                address = Address.objects.get(id=address_id, user=request.user)

                # 2️⃣ Get cart (do NOT delete)
                cart = Cart.objects.get(user=request.user)
                cart_items_qs = CartItem.objects.filter(cart=cart)

                if not cart_items_qs.exists():
                    return Response(
                        {"error": "Cart is empty"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                # 3️⃣ Create UNPAID order
                order = Order.objects.create(
                    user=request.user,
                    address=address,
                    total_price=0,
                    status="Pending",
                    payment_method="ONLINE",
                    payment_status="PENDING",
                )

                # 4️⃣ Create order items
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
