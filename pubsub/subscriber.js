const redis = require('redis');

const subscriber = redis.createClient();

subscriber.on('message', (channel, message) => {
    console.log(`Message "${message}" on channel "${channel}" arrived!`)
});

subscriber.subscribe('my channel');