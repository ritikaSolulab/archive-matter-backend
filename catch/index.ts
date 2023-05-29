import config from '../config/config';
import { createClient } from 'redis';
import { info, error } from '../config/logger';

const redisURL = `redis://:${config.REDIS.password}@${config.REDIS.host}:${config.REDIS.port}`;

const client = createClient({ url: redisURL });

client.on('connect', () => info('Cache is connecting'));
client.on('ready', () => info('Cache is ready'));
client.on('end', () => info('Cache disconnected'));
client.on('reconnecting', () => info('Cache is reconnecting'));
client.on('error', (e) => error(e));

(async () => {
    await client.connect();
})();


export default client;