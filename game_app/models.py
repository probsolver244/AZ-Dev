# Create your models here.
# game_app/models.py

from django.db import models
from django.conf import settings
from django.contrib.auth.models import User
import uuid
from django.utils import timezone

class Question(models.Model):
    text = models.TextField()
    correct_answer = models.CharField(max_length=255)
    incorrect_answers = models.JSONField()

    def __str__(self):
        return self.text

class Game(models.Model):
    STATUS_CHOICES = [
        ('waiting', 'Waiting'),
        ('active', 'Active'),
        ('completed', 'Completed'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='owned_games', on_delete=models.CASCADE)
    participants = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='participating_games')
    current_question = models.ForeignKey(Question, null=True, blank=True, on_delete=models.SET_NULL)
    game_status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='waiting')
    created_at = models.DateTimeField(auto_now_add=True)
    started_at = models.DateTimeField(null=True, blank=True)
    incorrect_count = models.IntegerField(default=0)
    max_incorrect = models.IntegerField(default=3)
    time_limit = models.IntegerField(default=600)  # 10 minutes

    def start_game(self):
        self.started_at = timezone.now()
        self.game_status = 'active'
        self.current_question = self.get_next_question()
        self.incorrect_count = 0
        self.save()

    def get_next_question(self):
        return Question.objects.order_by('?').first()

    def update_incorrect_count(self, is_correct):
        if not is_correct:
            self.incorrect_count += 1
        if self.incorrect_count >= self.max_incorrect or self.is_time_up():
            self.end_game()
        else:
            self.current_question = self.get_next_question()
        self.save()

    def is_time_up(self):
        if not self.started_at:
            return False
        elapsed_time = (timezone.now() - self.started_at).total_seconds()
        return elapsed_time >= self.time_limit

    def end_game(self):
        self.game_status = 'completed'
        self.save()

    def __str__(self):
        return f"Game {self.id} ({self.game_status})"
