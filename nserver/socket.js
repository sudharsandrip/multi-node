/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
const { redis, ioEmitter } = require('./redisFns');

async function updateRoomCount({ room, socketId, connected }) {
    try {
        if (!room || !socketId) return;

        if (connected) {
            await redis.set(`socket:${room}:${socketId}`, true);
        } else {
            await redis.del(`socket:${room}:${socketId}`);
        }
    } catch (error) {
        logger.error(error);
    }
}

module.exports = (io) => {
    io.sockets.on('connection', (socket) => {
        console.log('new connection!', socket.id);
        socket.on('disconnect', () => {
            if (socket._room) {
                updateRoomCount({
                    room: socket._room,
                    socketId: socket.id,
                    connected: false,
                })
                    .then(() => {
                        // emitUsersCount(`live_view_count:${socket._room}`, socket._room)
                    })
                    .catch((err) => {
                        logger.error(err);
                    });
            }
        });

        socket.on('join_room', (data) => {
            console.log('join_room', data);
            socket.join(data);
            socket._room = data;

            updateRoomCount({
                room: socket._room,
                socketId: socket.id,
                connected: true,
            })
                .then(() => {
                    // emitUsersCount('live_view_count', socket._room)
                })
                .catch((err) => {
                    logger.error(err);
                });
        });

        socket.on('local_message', data => {
            console.log(data);
            ioEmitter.to('room1').emit('global_message', {
                ...data,
                ts: Date.now(),
              });
        });
    });
};
