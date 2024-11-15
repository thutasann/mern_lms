import { createAdapter } from '@socket.io/redis-adapter';
import { Emitter } from '@socket.io/redis-emitter';
import { createClient } from 'redis';
import { Server } from 'socket.io';
import { setupChatGateway } from './gateways/chat.gateway';

/**
 * Create socket server
 * @returns {Promise<{ io: Server; emitter: Emitter }>} - socket.io server and emitter instances
 */
export const createSocketServer = async (): Promise<{
	io: Server;
	emitter: Emitter;
}> => {
	/** Create socket.io server */
	const io = new Server({
		cors: {
			origin: '*',
			methods: ['GET', 'POST'],
			allowedHeaders: ['*'],
			credentials: true,
		},
		path: '/socket.io/',
		transports: ['websocket', 'polling'],
		pingTimeout: 60000,
		pingInterval: 30000,
		upgradeTimeout: 30000,
		maxHttpBufferSize: 1e7, // 10MB
	});

	const MAX_RETRIES = 5;
	const RETRY_DELAY = 2000; // 2

	/** Set up Redis adapter */
	const pubClient = createClient({
		url: process.env.REDIS_URL,
		socket: {
			connectTimeout: 10000,
			reconnectStrategy: (retries) => {
				if (retries > MAX_RETRIES) {
					return new Error('Max retries reached, giving up');
				}
				return RETRY_DELAY;
			},
		},
	});

	/** Duplicate pubClient */
	const subClient = pubClient.duplicate();

	/** Connect to Redis */
	await Promise.all([pubClient.connect(), subClient.connect()]);

	/** Apply Redis adapter */
	io.adapter(createAdapter(pubClient, subClient));

	/** Create Redis emitter */
	const emitter = new Emitter(pubClient);

	/** Apply global middleware */
	io.use((socket, next) => {
		next();
	});

	/** Initialize gateways */
	setupChatGateway(io);

	return { io, emitter };
};
