from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    age = models.IntegerField(null=True, blank=True)
    weight = models.FloatField(null=True, blank=True)
    height = models.FloatField(null=True, blank=True)
    gender = models.CharField(max_length=10, blank=True)
    fitness_goal = models.CharField(max_length=100, blank=True)
    activity_level = models.CharField(max_length=50, blank=True)
    medical_conditions = models.TextField(blank=True)
    dietary_restrictions = models.TextField(blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    
    def __str__(self):
        return self.username
