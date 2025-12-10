from django.db import models
from django.conf import settings

class Goal(models.Model):
    GOAL_CATEGORIES = [
        ('weight', 'Weight'),
        ('workout', 'Workout'),
        ('nutrition', 'Nutrition'),
        ('measurement', 'Measurement'),
    ]

    STATUS_CHOICES = [
        ('not_started', 'Not Started'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, 
                           on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=50, choices=GOAL_CATEGORIES)
    target = models.FloatField()
    current = models.FloatField(default=0)
    unit = models.CharField(max_length=50)
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(max_length=20, 
                            choices=STATUS_CHOICES,
                            default='not_started')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username}'s goal: {self.title}"
