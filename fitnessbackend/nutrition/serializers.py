from rest_framework import serializers
from .models import Food, Meal

class FoodSerializer(serializers.ModelSerializer):
    class Meta:
        model = Food
        fields = ['id', 'name', 'calories', 'protein', 'carbs', 'fats', 'serving_size']
        read_only_fields = ['id']

    def validate(self, data):
        # Validate nutritional values are positive
        for field in ['calories', 'protein', 'carbs', 'fats']:
            if data.get(field, 0) < 0:
                raise serializers.ValidationError(f"{field} cannot be negative")
        return data

class MealSerializer(serializers.ModelSerializer):
    class Meta:
        model = Meal
        fields = ['id', 'food', 'calories', 'meal_type', 'date', 'notes']
        read_only_fields = ['id']

    def validate(self, data):
        if data.get('calories', 0) <= 0:
            raise serializers.ValidationError({"calories": "Calories must be greater than 0"})
        return data

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)