# Create your models here.
# game_app/models.py

from django.db import models
from django.conf import settings
from django.contrib.auth.models import User


class Game(models.Model):
    STATUS_CHOICES = [
        ('waiting', 'Waiting'),
        ('active', 'Active'),
        ('completed', 'Completed'),
    ]

    game_id = models.AutoField(primary_key=True)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='owned_games')
    game_status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='waiting')
    participants = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='participating_games')

    def __str__(self):
        return f"Game {self.game_id} ({self.game_status})"
