# game_app/consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth.models import User
from .models import Game

class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.game_id = self.scope['url_route']['kwargs']['game_id']
        self.room_group_name = f'game_{self.game_id}'

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        action = data.get('action')

        if action == 'join_request':
            user = data.get('user')


            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'join_request',
                    'user': user
                }
            )
        
        elif action == 'accept_request':
            user_id = data.get('user_id')
            game = Game.objects.get(id=self.game_id)
            user = User.objects.get(id=user_id)
            game.participants.add(user)
            game.status = 'active'
            game.save()

            # Notify both players
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'game_update',
                    'message': f'Game {self.game_id} is now active!',
                }
            )
            await self.channel_layer.group_send(
                f'user_{user_id}',
                {
                    'type': 'game_update',
                    'message': f'You have joined game {self.game_id}!',
                }
            )


    async def join_request(self, event):
        user = event['user']
        await self.send(text_data=json.dumps({
            'type': 'join_request',
            'user': user
        }))
    
    async def game_update(self, event):
        message = event['message']
        await self.send(text_data=json.dumps({
            'type': 'game_update',
            'message': message
        }))
