import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MCQ = ({ gameId }) => {
    const [game, setGame] = useState(null);
    const [answer, setAnswer] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`/api/games/${gameId}/`)
            .then(response => {
                setGame(response.data);
                setLoading(false);
            })
            .catch(error => {
                setError(error.message);
                setLoading(false);
            });
    }, [gameId]);

    const handleSubmit = () => {
        axios.post(`/api/games/submit-answer/${gameId}/`, { answer })
            .then(response => {
                setGame(response.data);
            })
            .catch(error => {
                setError(error.message);
            });
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            {game && game.game_status !== 'completed' ? (
                <div>
                    <p>{game.current_question.text}</p>
                    {game.current_question.incorrect_answers.concat(game.current_question.correct_answer).map((ans, idx) => (
                        <button key={idx} onClick={() => setAnswer(ans)}>{ans}</button>
                    ))}
                    <button onClick={handleSubmit}>Submit Answer</button>
                </div>
            ) : (
                <p>Game over. The winner is: {game && game.scores && Object.keys(game.scores).length ? `Player ${game.get_winner()} with ${game.scores[game.get_winner()]} points` : 'No one'}</p>
            )}
        </div>
    );
};

export default MCQ;
