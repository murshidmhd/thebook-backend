from rest_framework.views import APIView
from rest_framework.response import Response
from products.models import Order
from .serializer import OrderSerializer
from rest_framework import status


class OrderManagementView(APIView):
    def get(self, request):
        orders = Order.objects.all().order_by("-created_at")
        serialiezer = OrderSerializer(orders, many=True)
        return Response(serialiezer.data, status=status.HTTP_200_OKI)

    def patch(self, request):
        order_id = request.data.get("order_id")
        try:
            order = Order.objects.get(id=order_id)
        except Order.DoesNotExist:
            return Response(
                {"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND
            )

        serializer = OrderSerializer(order, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
