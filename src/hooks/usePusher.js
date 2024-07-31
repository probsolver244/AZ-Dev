import Pusher from 'pusher-js';

const usePusher = (channelName, eventName, callback) => {
  useEffect(() => {
    const pusher = new Pusher('your_key', {
      cluster: 'your_cluster',
      encrypted: true
    });

    const channel = pusher.subscribe(channelName);
    channel.bind(eventName, callback);

    return () => {
      channel.unbind(eventName, callback);
      pusher.unsubscribe(channelName);
    };
  }, [channelName, eventName, callback]);
};

export default usePusher;
