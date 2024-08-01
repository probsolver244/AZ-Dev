# game_app/urls.py
# game_app/urls.py

from django.urls import path
from .views import StartGameView,GameCreateView, GameListCreateView, GameRetrieveUpdateDestroyView,GameListView, JoinGameView, SubmitAnswerView
from .views import AcceptJoinRequestView

urlpatterns = [
    path('start/<uuid:game_id>/', StartGameView.as_view(), name='start-game'),
    path('games/', GameListCreateView.as_view(), name='game-list-create'),
    path('games/<uuid:pk>/', GameRetrieveUpdateDestroyView.as_view(), name='game-detail'),
    path('games/create/', GameCreateView.as_view(), name='game-create'),
    path('games/waiting/', GameListView.as_view(), name='game-list-waiting'),
    path('games/join/<uuid:pk>/', JoinGameView.as_view(), name='game-join'),
    path('accept-join-request/<uuid:game_id>/', AcceptJoinRequestView.as_view(), name='accept-join-request'),
    path('submit-answer/<uuid:game_id>/', SubmitAnswerView.as_view(), name='submit-answer'),
]
