from django.conf import settings
from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Game
from .serializers import GameSerializer
from django.contrib.auth.models import User
import pusher

pusher_client = pusher.Pusher(
    app_id=settings.PUSHER_APP_ID,
    key=settings.PUSHER_KEY,
    secret=settings.PUSHER_SECRET,
    cluster=settings.PUSHER_CLUSTER,
    ssl=settings.PUSHER_SSL
)

class StartGameView(APIView):
    def post(self, request, game_id):
        game = get_object_or_404(Game, id=game_id)
        if request.user != game.owner:
            return Response({'error': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)
        
        game.status = 'active'
        game.save()

        # Trigger a Pusher event
        pusher_client.trigger('game-channel', 'game-start', {'game_id': game.id})

        return Response({'status': 'Game started'}, status=status.HTTP_200_OK)

class GameCreateView(generics.CreateAPIView):
    queryset = Game.objects.all()
    serializer_class = GameSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class GameListCreateView(generics.ListCreateAPIView):
    queryset = Game.objects.all()
    serializer_class = GameSerializer
    permission_classes = [IsAuthenticated]

class GameRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Game.objects.all()
    serializer_class = GameSerializer
    permission_classes = [IsAuthenticated]

class GameListView(generics.ListAPIView):
    serializer_class = GameSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        This view returns a list of all games that are in the 'waiting' status.
        """
        return Game.objects.filter(game_status='waiting')

class JoinGameView(APIView):
    def post(self, request, pk):
        try:
            game = Game.objects.get(pk=pk)
        except Game.DoesNotExist:
            return Response({'error': 'Game not found.'}, status=status.HTTP_404_NOT_FOUND)

        if game.game_status != 'waiting':
            return Response({'error': 'Cannot join this game.'}, status=status.HTTP_400_BAD_REQUEST)

        # Add logic to handle joining the game here
        # For example, adding the user to the participants list
        return Response({'message': 'Successfully joined the game.'}, status=status.HTTP_200_OK)

class AcceptJoinRequestView(APIView):
    def post(self, request, game_id):
        game = get_object_or_404(Game, id=game_id)
        if request.user != game.owner:
            return Response({'error': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)
        
        user_id = request.data.get('user_id')
        user = get_object_or_404(User, id=user_id)
        game.participants.add(user)
        game.status = 'active'
        game.save()
        return Response({'status': 'Game updated'}, status=status.HTTP_200_OK)
