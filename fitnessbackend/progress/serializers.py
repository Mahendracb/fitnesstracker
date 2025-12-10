from rest_framework import serializers
from .models import ProgressEntry, BodyMeasurement

class ProgressEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProgressEntry
        fields = ['id', 'date', 'weight', 'calories_consumed', 'workouts_completed']
        
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class BodyMeasurementSerializer(serializers.ModelSerializer):
    class Meta:
        model = BodyMeasurement
        fields = ['id', 'date', 'chest', 'waist', 'hips', 'biceps', 'thighs']
        
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)