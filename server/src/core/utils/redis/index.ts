import { Redis } from 'ioredis';
import { APIError } from '../error/errors';
import { logger } from '../logger';

/** Redis Client @internal */
const redisClient = (): string => {
	if (process.env.REDIS_URL) {
		logger.info(`Redis Connected. 🧰`);
		return process.env.REDIS_URL;
	}
	throw new APIError('Redis connection failed');
};

/** Redis Instance */
const redis = new Redis(redisClient());

redis.on('error', (error) => {
	logger.error(`Redis connection error : ${error.message}`);
});

redis.on('connect', () => {
	logger.info('Redis connected successfully 🚀');
});

redis.on('ready', () => {
	logger.info('Redis is ready to accept commands 🧰');
});

redis.on('close', () => {
	logger.warn('Redis connection closed');
});

redis.on('reconnecting', () => {
	logger.info('Redis attempting to reconnect...');
});

const gracefulShutdown = async () => {
	try {
		await redis.quit();
		logger.info('Redis connection closed gracefully');
		process.exit(0);
	} catch (error) {
		logger.error('Error during Redis shutdown:', error);
		process.exit(1);
	}
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

export default redis;
