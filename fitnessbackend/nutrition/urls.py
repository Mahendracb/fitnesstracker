from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FoodViewSet, MealViewSet

router = DefaultRouter()
router.register(r'foods', FoodViewSet)
router.register(r'meals', MealViewSet, basename='meal')

urlpatterns = [
    path('', include(router.urls)),
]