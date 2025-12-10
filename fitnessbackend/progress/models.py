from django.db import models
from django.conf import settings

class ProgressEntry(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    date = models.DateField()
    weight = models.FloatField(null=True, blank=True)
    calories_consumed = models.IntegerField(null=True, blank=True)
    workouts_completed = models.IntegerField(null=True, blank=True)
    
    class Meta:
        ordering = ['-date']
        verbose_name_plural = 'Progress Entries'

class BodyMeasurement(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    date = models.DateField()
    chest = models.FloatField(null=True, blank=True)
    waist = models.FloatField(null=True, blank=True)
    hips = models.FloatField(null=True, blank=True)
    biceps = models.FloatField(null=True, blank=True)
    thighs = models.FloatField(null=True, blank=True)
    
    class Meta:
        ordering = ['-date']
