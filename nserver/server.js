const express = require('express');
require('dotenv').config();
const { redisAdapter } = require('./redisFns');


const app = express();

app.get('/', (req, res) => {
    // res.end(`Hi, PID: ${process.pid}`);
    return res.json(`PORT: ${process.env.PORT}`);
});

const server = app.listen(process.env.PORT);

const io = require('socket.io')(server, {
    path: '/ws',
    cors: {
        origin: '*',
    },
    transports: ['websocket', 'polling'],
});

io.adapter(redisAdapter);

require('./socket')(io);

console.log(`Server running on ${process.env.PORT} port, PID: ${process.pid}`);