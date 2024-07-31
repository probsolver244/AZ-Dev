// src/components/lobby/game.service.js
import axios from 'axios'; // Use a standard import for axios
import axiosInstance from '../../services/api/axios.instance';

const API_URL = 'http://127.0.0.1:8000/api/games/waiting/';
export const getAvailableGames = async (id) => {
    return await axiosInstance.get(`/api/games/waiting/`);
  };


export const joinGame = async (gameId) => {
    try {
        const response = await axios.post(`http://127.0.0.1:8000/api/games/join/${gameId}/`, {}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error joining the game:', error.message);
        throw error;
    }
};
