from rest_framework.views import APIView
from products.models import Product
from rest_framework.response import Response
from products.serializers import ProductReadSerializer, ProductWriteSerializer
from rest_framework import status
from rest_framework.permissions import IsAdminUser, IsAuthenticated


class ProductManagement(APIView):
    permission_classes = [IsAdminUser]

    def get_object(self, product_id):
        print(product_id)
        try:
            return Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            raise status.HTTP_404_NOT_FOUND

    def get(self, request):
        products = Product.objects.all()
        serialiser = ProductReadSerializer(products, many=True)

        return Response(serialiser.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = ProductWriteSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()

            return Response(
                {"messsage": "Product created successfully"},
                status=status.HTTP_201_CREATED,
            )
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        product_id = request.data.get("product_id")

        try:
            # 2. Use the ID to find the product instance
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response(
                {"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND
            )
        serializer = ProductWriteSerializer(product, data=request.data)
        if serializer.is_valid():
            serializer.save()

            return Response(serializer.data)
        print(
            serializer.errors
        )  # this for serializer error vannu beacuse of image so ath solve akaan
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request):
        product = self.get_object(request.data.get("product_id"))

        serializer = ProductWriteSerializer(product, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        product = self.get_object(request.data.get("product_id"))
        
        
        product.delete()
        return Response(
            {"message": "Deleted successfullly"}, status=status.HTTP_204_NO_CONTENT
        )


class Is_Staff_View(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not request.user.is_staff:
            return Response(
                {"details": "You are not authoraized"}, status=status.HTTP_403_FORBIDDEN
            )
        return Response({"detail": "Staff access granted"}, status=status.HTTP_200_OK)
