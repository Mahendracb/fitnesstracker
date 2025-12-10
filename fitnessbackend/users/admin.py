from django.contrib import admin
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'fitness_goal')
    fieldsets = (
        *UserAdmin.fieldsets,
        (
            'Fitness Profile',
            {
                'fields': (
                    'age',
                    'weight',
                    'height',
                    'gender',
                    'fitness_goal',
                    'activity_level',
                    'medical_conditions',
                    'dietary_restrictions',
                    'date_of_birth',
                )
            }
        )
    )
# Register your models here.
