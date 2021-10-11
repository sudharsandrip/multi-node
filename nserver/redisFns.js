const Redis = require('ioredis');
const RedisAdapter = require('socket.io-redis');
const { Emitter } = require('@socket.io/redis-emitter');

const COMMON_DB = 0;
const SOCKET_DB = 0;
const { REDIS_TLS_URL, REDIS_URL, NODE_ENV } = process.env;

const tls =
  NODE_ENV !== 'development' ? { rejectUnauthorized: false } : undefined;

const redis = new Redis(`${REDIS_TLS_URL || REDIS_URL}/${COMMON_DB}`, {
  tls,
});

const redisAdapter = RedisAdapter(
  `${REDIS_TLS_URL || REDIS_URL}/${SOCKET_DB}`,
  {
    tls,
  }
);

const ioEmitter = new Emitter(redis);

module.exports = {
  redis,
  redisAdapter,
  ioEmitter,
};
