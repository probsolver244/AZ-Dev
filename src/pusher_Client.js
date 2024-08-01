// src/pusherClient.js

import Pusher from 'pusher-js';

const pusher = new Pusher('5a8cf4acbfa2cd4ac109', {
  cluster: 'ap2',
  encrypted: true
});

const channel = pusher.subscribe('game-channel');

channel.bind('game-start', function(data) {
  alert(`Game ${data.game_id} has started!`);
});

export default pusher;
