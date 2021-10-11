/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
const { redis } = require('./redisFns');

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
            socket.join(data.room);
            socket._room = data.room;

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
            console.log('local_message', data);
        });
    });
};
