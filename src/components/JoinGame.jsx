// src/components/JoinGame.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, List, Typography, notification } from 'antd';

const { Title } = Typography;

const JoinGame = () => {
  const [games, setGames] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/games/waiting/');
        setGames(response.data);
      } catch (error) {
        console.error('Error fetching games:', error);
      }
    };

    fetchGames();

    // Establish WebSocket connection
    const ws = new WebSocket('ws://localhost:8000/ws/games/');
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'join_request') {
        notification.info({
          message: 'Join Request',
          description: `User ${data.user} has requested to join the game.`,
        });
      }
    };
    
    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  const joinGame = async (gameId) => {
    try {
      await axios.post(`http://localhost:8000/api/games/join/${gameId}/`);
      
      // Send a join request via WebSocket
      if (socket) {
        socket.send(JSON.stringify({
          action: 'join_request',
          user: 'User Name', // Replace with actual user info
        }));
      }
      
      alert('Successfully sent join request!');
    } catch (error) {
      console.error('Error sending join request:', error);
      alert('Error sending join request.');
    }
  };

  return (
    <div>
      <Title level={2}>Available Games</Title>
      <List
        dataSource={games}
        renderItem={game => (
          <List.Item
            actions={[
              <Button onClick={() => joinGame(game.game_id)}>Join Game</Button>,
            ]}
          >
            <List.Item.Meta
              title={`Game ID: ${game.game_id}`}
              description={`Owner: ${game.owner}`}
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default JoinGame;
