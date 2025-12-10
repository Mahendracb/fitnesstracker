from django.contrib import admin
from .models import Exercise, Workout, WeightEntry

@admin.register(Exercise)
class ExerciseAdmin(admin.ModelAdmin):
    list_display = ('name', 'muscle_group', 'equipment')
    search_fields = ('name', 'description')
    list_filter = ('muscle_group', 'equipment')

@admin.register(Workout)
class WorkoutAdmin(admin.ModelAdmin):
    list_display = ('user', 'exercise', 'sets', 'reps', 'date')
    list_filter = ('date', 'user')
    search_fields = ('exercise', 'user__username')
    date_hierarchy = 'date'
    ordering = ('-date',)  # Remove created_at from ordering

@admin.register(WeightEntry)
class WeightEntryAdmin(admin.ModelAdmin):
    list_display = ('user', 'date', 'weight')
    list_filter = ('date',)
    search_fields = ('user__username',)
