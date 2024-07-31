# game_app/urls.py
# game_app/urls.py

from django.urls import path
from .views import GameCreateView, GameListCreateView, GameRetrieveUpdateDestroyView,GameListView, JoinGameView
from .views import AcceptJoinRequestView

urlpatterns = [
    path('games/', GameListCreateView.as_view(), name='game-list-create'),
    path('games/<int:pk>/', GameRetrieveUpdateDestroyView.as_view(), name='game-detail'),
    path('games/create/', GameCreateView.as_view(), name='game-create'),
    path('games/waiting/', GameListView.as_view(), name='game-list-waiting'),
    path('games/join/<int:pk>/', JoinGameView.as_view(), name='game-join'),
     path('accept-join-request/<int:game_id>/', AcceptJoinRequestView.as_view(), name='accept-join-request'),
]
