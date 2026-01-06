from django.urls import path
from dashboard.views import RevenueDashboardView, RevenueLineChartView

urlpatterns = [
    path("revenue/", RevenueDashboardView.as_view()),
    path("revenue-chart/", RevenueLineChartView.as_view()),
]
