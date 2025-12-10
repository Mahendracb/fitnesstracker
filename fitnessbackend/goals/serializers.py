from rest_framework import serializers
from .models import Goal

class GoalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Goal
        fields = ['id', 'title', 'description', 'target', 'current', 
                 'category', 'unit', 'start_date', 'end_date', 
                 'status', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate(self, data):
        """Custom validation for goal data"""
        if data.get('target', 0) <= 0:
            raise serializers.ValidationError(
                {"target": "Target value must be greater than 0"}
            )
        if data.get('current', 0) < 0:
            raise serializers.ValidationError(
                {"current": "Current value cannot be negative"}
            )
        return data