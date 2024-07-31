// src/hooks/useWebSocket.js
import { useState, useEffect } from 'react';
const useWebSocket = (gameId) => {
  const [ws, setWs] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (gameId) {  // Ensure gameId is valid
      const socket = new WebSocket(`ws://localhost:8000/ws/games/${gameId}/`);

      socket.onopen = () => {
        console.log('WebSocket connection established');
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setMessage(data.message);
      };

      socket.onclose = () => {
        console.log('WebSocket connection closed');
      };

      setWs(socket);

      return () => {
        socket.close();
      };
    }
  }, [gameId]);

  return { ws, message };
};

export default useWebSocket;
