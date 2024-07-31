// src/components/lobby/AvailableGames.jsx
import React, { useState, useEffect } from 'react';
import { getAvailableGames, joinGame } from './game.service';
import useWebSocket from '../../hooks/useWebSocket';

const AvailableGames = () => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentGameId, setCurrentGameId] = useState(null);
    const { message } = useWebSocket(currentGameId);
    

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const gamesList = await getAvailableGames();
                setGames(gamesList);
            } catch (err) {
                setError('Failed to fetch games');
            } finally {
                setLoading(false);
            }
        };

        fetchGames();
    }, []);

    const handleJoinGame = async (gameId) => {
        try {
            await joinGame(gameId);
            alert('Successfully joined the game');
            // Optionally refresh the game list
            const gamesList = await getAvailableGames();
            setGames(gamesList);
            setCurrentGameId(gameId);
        } catch (err) {
            alert('Failed to join the game');
        }
    };

    useEffect(() => {
        if (message) {
            console.log('Received message:', message);
        }
    }, [message]);

    if (loading) return <p>Loading games...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h2>Available Games</h2>
            <ul>
                {games.map(game => (
                    <li key={game.game_id}>
                        <p><strong>Game ID:</strong> {game.game_id}</p>
                        <p><strong>Owner:</strong> {game.owner}</p>
                        <button onClick={() => handleJoinGame(game.game_id)}>Join Game</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AvailableGames;
