from django.contrib import admin
from .models import Food, Meal

@admin.register(Meal)
class MealAdmin(admin.ModelAdmin):
    list_display = ('user', 'food', 'calories', 'meal_type', 'date')
    list_filter = ('meal_type', 'date', 'user')
    search_fields = ('food', 'user__username')
    date_hierarchy = 'date'
    ordering = ('-date',)  # Changed to only use date field
