import { Redis } from 'ioredis';
import { logger } from '../logger';
import { APIError } from '../error/errors';

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

export default redis;
