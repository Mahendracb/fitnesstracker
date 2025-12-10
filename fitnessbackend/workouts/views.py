from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from django.core.exceptions import ValidationError
from .models import Exercise, Workout, WeightEntry
from .serializers import ExerciseSerializer, WorkoutSerializer, WeightEntrySerializer
from django.db.models import Q, Max, Avg, Count
from datetime import datetime, timedelta
from rest_framework.decorators import action

class ExerciseViewSet(viewsets.ModelViewSet):
    queryset = Exercise.objects.all()
    serializer_class = ExerciseSerializer
    permission_classes = [permissions.IsAuthenticated]

class WorkoutViewSet(viewsets.ModelViewSet):
    serializer_class = WorkoutSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Return workouts for the current user"""
        user = self.request.user
        # Get date parameter or default to last 7 days
        date_from = self.request.query_params.get('date_from')
        if date_from:
            return Workout.objects.filter(user=user, date__gte=date_from)
        
        # Default to last 7 days
        week_ago = datetime.now().date() - timedelta(days=7)
        return Workout.objects.filter(user=user, date__gte=week_ago)

    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            return Response(
                {'detail': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {'detail': 'An error occurred while saving the workout'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.user != request.user:
            return Response(
                {"detail": "Not authorized to update this workout"}, 
                status=status.HTTP_403_FORBIDDEN
            )
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.user != request.user:
            return Response(
                {"detail": "Not authorized to delete this workout"}, 
                status=status.HTTP_403_FORBIDDEN
            )
        return super().destroy(request, *args, **kwargs)

    @action(detail=False, methods=['get'])
    def history(self, request):
        """Get workout history filtered by time range"""
        time_range = request.query_params.get('timeRange', 'month')
        today = datetime.now().date()
        
        if time_range == 'week':
            start_date = today - timedelta(days=7)
        elif time_range == 'month':
            start_date = today - timedelta(days=30)
        else:  # year
            start_date = today - timedelta(days=365)
            
        workouts = self.get_queryset().filter(date__gte=start_date)
        serializer = self.get_serializer(workouts, many=True)
        
        return Response(serializer.data)

class WeightEntryViewSet(viewsets.ModelViewSet):
    serializer_class = WeightEntrySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return WeightEntry.objects.filter(user=self.request.user)
