// const io = require('socket.io')(process.env.PORT);

const io = require("socket.io")(process.env.PORT, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

io.on('connection', (socket) => {
    console.log(`${socket.id} connected`);
});

console.log(`Socket Server running on ${process.env.PORT} port, PID: ${process.pid}`);