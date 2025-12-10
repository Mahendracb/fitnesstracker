from rest_framework import serializers
from .models import Exercise, Workout, WeightEntry

class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = '__all__'

class WorkoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workout
        fields = ['id', 'exercise', 'sets', 'reps', 'weight', 'date', 'notes']
        read_only_fields = ['id']

    def validate(self, data):
        if not data.get('exercise'):
            raise serializers.ValidationError({"exercise": "This field is required"})
        if not data.get('date'):
            raise serializers.ValidationError({"date": "This field is required"})
        return data

class WeightEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = WeightEntry
        fields = ['id', 'date', 'weight']