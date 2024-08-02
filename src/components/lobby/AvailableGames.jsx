// src/components/lobby/AvailableGames.jsx
import React, { useState, useEffect } from 'react';
import { getAvailableGames, joinGame } from './game.service';
import useWebSocket from '../../hooks/useWebSocket';
import axios from 'axios';

const AvailableGames = () => {
    const [games, setGames] = useState([]); // Initialize as empty array
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentGameId, setCurrentGameId] = useState(null);
    const { message } = useWebSocket(currentGameId);

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const gamesData= await getAvailableGames();
                console.log(gamesData); // Log the data to check its format
                if (Array.isArray(gamesData)) {
                    setGames(gamesData); // Ensure response.data is an array
                } else if (gamesData.results && Array.isArray(gamesData.results)) {
                    setGames(gamesData.results); // Handle paginated results
                } else {
                    setGames([]); // Handle unexpected data format
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchGames();
    }, []);

    useEffect(() => {
        if (message) {
            console.log('Received message:', message);
            // Optionally handle the WebSocket message here
        }
    }, [message]);

    const handleJoinGame = async (gameId) => {
        try {
            await joinGame(gameId);
            alert('Successfully joined the game');
            // Optionally refresh the game list
            const gamesData= await getAvailableGames();
            console.log(gamesData); // Log the data to check its format
            if (Array.isArray(gamesData)) {
                setGames(gamesData); // Ensure response.data is an array
            } else if (gamesData.results && Array.isArray(gamesData.results)) {
                setGames(gamesData.results); // Handle paginated results
            } else {
                setGames([]); // Handle unexpected data format
            }
            setCurrentGameId(gameId);
        } catch (err) {
            alert('Failed to join the game');
        }
    };

    if (loading) return <p>Loading games...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h2>Available Games</h2>
            {games.length === 0 ? (
                <p>No games available.</p>
            ) : (
                <ul>
                    {games.map(game => (
                        <li key={game.id}>
                            <p><strong>Game ID:</strong> {game.id}</p>
                            <p><strong>Owner:</strong> {game.owner}</p>
                            <button onClick={() => handleJoinGame(game.id)}>Join Game</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AvailableGames;
