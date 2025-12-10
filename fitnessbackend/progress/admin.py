from django.contrib import admin
from .models import ProgressEntry, BodyMeasurement

@admin.register(ProgressEntry)
class ProgressEntryAdmin(admin.ModelAdmin):
    list_display = ('user', 'date', 'weight', 'calories_consumed', 'workouts_completed')
    list_filter = ('date', 'user')
    search_fields = ('user__username',)

@admin.register(BodyMeasurement)
class BodyMeasurementAdmin(admin.ModelAdmin):
    list_display = ('user', 'date', 'chest', 'waist', 'hips', 'biceps', 'thighs')
    list_filter = ('date', 'user')
    search_fields = ('user__username',)
