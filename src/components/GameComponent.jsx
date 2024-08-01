// src/components/GameComponent.jsx

import React, { useEffect } from 'react';
import pusher from '../pusherClient';

const GameComponent = () => {
  useEffect(() => {
    const channel = pusher.subscribe('game-channel');
    channel.bind('game-start', function(data) {
      alert(`Game ${data.game_id} has started!`);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  return (
    <div>
      {/* Your component code */}
    </div>
  );
};

export default GameComponent;
