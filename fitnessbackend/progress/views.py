from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Avg
from .models import ProgressEntry, BodyMeasurement
from .serializers import ProgressEntrySerializer, BodyMeasurementSerializer

class ProgressEntryViewSet(viewsets.ModelViewSet):
    """
    Routes (when progress.urls is included at /api/progress/ and router.register('progress', ...)):
    - GET  /api/progress/progress/                     -> list
    - POST /api/progress/progress/                     -> create
    - GET  /api/progress/progress/{pk}/                -> retrieve
    - PUT  /api/progress/progress/{pk}/                -> update
    - DELETE /api/progress/progress/{pk}/              -> destroy
    - GET  /api/progress/progress/weight_history/      -> weight history (date, weight)
    - GET  /api/progress/progress/nutrition_history/   -> nutrition history (date, calories_consumed)
    - GET  /api/progress/progress/workout_history/     -> workout history (date, workouts_completed)
    """
    serializer_class = ProgressEntrySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ProgressEntry.objects.filter(user=self.request.user).order_by('date')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'], url_path='weight_history')
    def weight_history(self, request):
        qs = self.get_queryset().values('date', 'weight')
        return Response(qs, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='nutrition_history')
    def nutrition_history(self, request):
        qs = self.get_queryset().values('date', 'calories_consumed')
        return Response(qs, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='workout_history')
    def workout_history(self, request):
        qs = self.get_queryset().values('date', 'workouts_completed')
        return Response(qs, status=status.HTTP_200_OK)


class BodyMeasurementViewSet(viewsets.ModelViewSet):
    """
    Routes:
    - GET  /api/progress/measurements/
    - POST /api/progress/measurements/
    - GET  /api/progress/measurements/{pk}/
    - PUT  /api/progress/measurements/{pk}/
    - DELETE /api/progress/measurements/{pk}/
    - GET  /api/progress/measurements/measurement_history/
    """
    serializer_class = BodyMeasurementSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return BodyMeasurement.objects.filter(user=self.request.user).order_by('date')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'], url_path='measurement_history')
    def measurement_history(self, request):
        qs = self.get_queryset().values('date', 'chest', 'waist', 'hips', 'biceps', 'thighs')
        return Response(qs, status=status.HTTP_200_OK)
