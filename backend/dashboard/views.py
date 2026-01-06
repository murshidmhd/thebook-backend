from rest_framework.views import APIView
from rest_framework.permissions import IsAdminUser
from products.models import Order
from django.db.models import Sum
from rest_framework.response import Response
from rest_framework import status
from django.db.models.functions import TruncDate



class RevenueDashboardView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        paid_orders = Order.objects.filter(status="Paid")

        total_revenue = paid_orders.aggregate(total=Sum("total_price"))["total"] or 0

        data = {
            "total_revenue": total_revenue,
            "total_orders": Order.objects.count(),
            "paid_orders": paid_orders.count(),
            "pending_orders": Order.objects.filter(status="Pending").count(),
        }

        return Response(data, status=status.HTTP_200_OK)


class RevenueLineChartView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        revenue_data = (
            Order.objects
            .filter(status="Paid")
            .annotate(date=TruncDate("created_at"))
            .values("date")
            .annotate(revenue=Sum("total_price"))
            .order_by("date")
        )

        chart_data = [
            {
                "date": item["date"].strftime("%Y-%m-%d"),
                "revenue": item["revenue"]
            }
            for item in revenue_data
        ]

        return Response(chart_data, status=status.HTTP_200_OK)
