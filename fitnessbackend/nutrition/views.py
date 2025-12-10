from django.shortcuts import render
from rest_framework import viewsets, permissions
from rest_framework.response import Response
from django.db.models import Sum
from .models import Food, Meal
from .serializers import FoodSerializer, MealSerializer

class FoodViewSet(viewsets.ModelViewSet):
    queryset = Food.objects.all()
    serializer_class = FoodSerializer
    permission_classes = [permissions.IsAuthenticated]

class MealViewSet(viewsets.ModelViewSet):
    serializer_class = MealSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Return meals for the current user only"""
        return Meal.objects.filter(user=self.request.user).order_by('-date')

    def perform_create(self, serializer):
        """Save the meal with the current user"""
        serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):
        """Custom create method to handle meal creation"""
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        """Custom update method to ensure user can only update their meals"""
        instance = self.get_object()
        if instance.user != request.user:
            return Response(
                {"detail": "Not authorized to update this meal"}, 
                status=status.HTTP_403_FORBIDDEN
            )
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        """Custom delete method to ensure user can only delete their meals"""
        instance = self.get_object()
        if instance.user != request.user:
            return Response(
                {"detail": "Not authorized to delete this meal"}, 
                status=status.HTTP_403_FORBIDDEN
            )
        return super().destroy(request, *args, **kwargs)
