from django.shortcuts import render
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserSerializer, RegisterSerializer
from .models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone
from datetime import timedelta
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.contrib.auth import get_user_model
from .serializers import UserSerializer

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

class UserDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

class LogoutView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        try:
            return Response({"message": "Successfully logged out."}, 
                          status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"message": str(e)}, 
                          status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    user = request.user
    today = timezone.now().date()
    
    # Calculate dashboard statistics
    stats = {
        'todayWorkouts': user.workout_set.filter(date=today).count(),
        'calories': sum(meal.calories for meal in user.meal_set.filter(date=today)),
        'weeklyWorkouts': user.workout_set.filter(
            date__gte=today - timedelta(days=7)
        ).count(),
        'activeMinutes': 145  # Example static value - replace with actual calculation
    }
    
    return Response(stats)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def recent_activity(request):
    # Implementation for recent activity
    return Response([])

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def progress_summary(request):
    # Implementation for progress summary
    return Response([])

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response(
            {
                'user': UserSerializer(user).data,
                'message': 'User registered successfully'
            },
            status=status.HTTP_201_CREATED
        )
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
# from rest_framework import generics, permissions, status
# from rest_framework.response import Response
# from rest_framework.views import APIView
# from django.utils import timezone
# from datetime import timedelta
# from rest_framework.decorators import api_view, permission_classes
# from rest_framework.permissions import IsAuthenticated, AllowAny
# from django.contrib.auth import get_user_model
# from .serializers import UserSerializer, RegisterSerializer

# User = get_user_model()


# # ✅ Registration endpoint
# class RegisterView(generics.CreateAPIView):
#     queryset = User.objects.all()
#     serializer_class = RegisterSerializer
#     permission_classes = [AllowAny]


# # ✅ Get/Update current user details
# class UserDetailView(generics.RetrieveUpdateAPIView):
#     serializer_class = UserSerializer
#     permission_classes = [permissions.IsAuthenticated]

#     def get_object(self):
#         return self.request.user


# # ✅ Logout endpoint
# class LogoutView(APIView):
#     permission_classes = [permissions.IsAuthenticated]

#     def post(self, request):
#         return Response({"message": "Successfully logged out."}, status=status.HTTP_200_OK)


# # ✅ Example protected route
# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def dashboard_stats(request):
#     user = request.user
#     today = timezone.now().date()

#     stats = {
#         "todayWorkouts": user.workout_set.filter(date=today).count(),
#         "calories": sum(meal.calories for meal in user.meal_set.filter(date=today)),
#         "weeklyWorkouts": user.workout_set.filter(date__gte=today - timedelta(days=7)).count(),
#         "activeMinutes": 145,  # Example static
#     }

#     return Response(stats)

# # @api_view(['GET'])
# # @permission_classes([IsAuthenticated])
# # def dashboard_stats(request):
# #     user = request.user
# #     today = timezone.now().date()