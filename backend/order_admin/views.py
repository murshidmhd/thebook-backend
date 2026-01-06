from rest_framework.views import APIView
from rest_framework.response import Response
from products.models import Order
from .serializer import OrderSerializer
from rest_framework import status


class OrderManagementView(APIView):
    def get(self, request):
        orders = Order.objects.all().order_by("-created_at")
        serialiezer = OrderSerializer(orders, many=True)
        return Response(serialiezer.data, status=status.HTTP_200_OK)

    def patch(self, request):
        order_id = request.data.get("order_id")
        new_status = request.data.get("status")

        if not order_id or not new_status:
            return Response(
                {"error": "order_id and status are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            order = Order.objects.get(id=order_id)
        except Order.DoesNotExist:
            return Response(
                {"error": "Order not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Optional: validate allowed statuses
        allowed_statuses = ["Pending", "Paid", "Shipped", "Delivered"]
        if new_status not in allowed_statuses:
            return Response(
                {"error": "Invalid status"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        order.status = new_status
        order.save(update_fields=["status"])

        return Response(
            {
                "message": "Order status updated successfully",
                "order_id": order.id,
                "status": order.status,
            },
            status=status.HTTP_200_OK,
        )

