# game_app/serializers.py

from rest_framework import serializers
from .models import Game, Question

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['id', 'text', 'correct_answer', 'incorrect_answers']

class GameSerializer(serializers.ModelSerializer):
    current_question = QuestionSerializer(read_only=True)

    class Meta:
        model = Game
        fields = ['id', 'owner', 'participants', 'current_question', 'game_status', 'created_at', 'started_at', 'incorrect_count', 'max_incorrect', 'time_limit']
        read_only_fields = ('game_status',)

    def create(self, validated_data):
        participants_data = validated_data.pop('participants', [])
        game = Game.objects.create(**validated_data)
        for participant in participants_data:
            game.participants.add(participant)
        return game

    def update(self, instance, validated_data):
        participants_data = validated_data.pop('participants', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if participants_data is not None:
            instance.participants.set(participants_data)
        instance.save()
        return instance

class SubmitAnswerSerializer(serializers.Serializer):
    answer = serializers.CharField(max_length=255)
