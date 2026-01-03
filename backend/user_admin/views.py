from accounts.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAdminUser
from .serializers import UserManagementSerializer
from django.db.models import Q


class UserManagementView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):

        search_query = request.query_params.get("search")

        users = User.objects.all().order_by("-date_joined")

        print(users)

        if search_query:
            users = users.filter(
                Q(username__icontains=search_query)
                | Q(email__icontains=search_query)
                | Q(first_name__icontains=search_query)
            )
        serializer = UserManagementSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = UserManagementSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get_object(self, pk):
        try:
            return User.objects.get(pk=pk)
        except User.DoesNotExist:
            return None


class UserDetailManagementView(APIView):
    permission_classes = [IsAdminUser]

    def get_object(self, pk):
        try:
            return User.objects.get(pk=pk)
        except User.DoesNotExist:
            return None

    def put(self, request, pk):

        user = self.get_object(pk)
        if not user:
            return Response(
                {"error": "User not found"}, status=status.HTTP_404_NOT_FOUND
            )

        serializer = UserManagementSerializer(user, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk):
       
        try:
            user = User.objects.get(pk=pk)

            if user == request.user:
                return Response(
                    {"error": "You cannot block your own admin account."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            
            serializer = UserManagementSerializer(user, data=request.data, partial=True)

            if serializer.is_valid():
                serializer.save()
                status_text = "active" if user.is_active else "blocked"
                return Response(
                    {
                        "message": f"User is now {status_text}",
                        "is_active": user.is_active,
                    },
                    status=status.HTTP_200_OK,
                )

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except User.DoesNotExist:
            return Response(
                {"error": "User not found"}, status=status.HTTP_404_NOT_FOUND
            )
