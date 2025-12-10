from django.db import models
from django.conf import settings

class Exercise(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    muscle_group = models.CharField(max_length=100)
    equipment = models.CharField(max_length=200)
    instructions = models.TextField()

    def __str__(self):
        return self.name

class Workout(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE,
        related_name='workouts'
    )
    exercise = models.CharField(max_length=200)
    sets = models.PositiveIntegerField()
    reps = models.PositiveIntegerField()
    weight = models.DecimalField(
        max_digits=6, 
        decimal_places=2, 
        null=True, 
        blank=True
    )
    date = models.DateField()
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date', '-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.exercise} ({self.date})"

class WeightEntry(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    date = models.DateField()
    weight = models.FloatField()

    class Meta:
        ordering = ['-date']
        verbose_name_plural = 'Weight entries'
