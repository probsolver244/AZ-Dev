"""
ASGI config for mcqbattle project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/asgi/
"""

import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from game_app import consumers
import django
from django.urls import path 

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mcqbattle.settings')


application = ProtocolTypeRouter({
    "http": get_asgi_application(),  # Django's default ASGI application for HTTP requests.

    "websocket": AuthMiddlewareStack(  # Handles WebSocket connections.
        URLRouter(
            [
                # Define WebSocket routes here.
                path("ws/games/<int:game_id>/", consumers.GameConsumer.as_asgi()),
            ]
        )
    ),
})
