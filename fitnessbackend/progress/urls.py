from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProgressEntryViewSet, BodyMeasurementViewSet

router = DefaultRouter()
router.register(r'progress', ProgressEntryViewSet, basename='progress')
router.register(r'measurements', BodyMeasurementViewSet, basename='measurements')

urlpatterns = [
    path('', include(router.urls)),
]