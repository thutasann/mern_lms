import { Server } from 'socket.io';
import { SOCKET_CONFIG } from '../src/core/configs/socket.config';
import { logger } from '../src/core/utils/logger';

/**
 * Create socket server
 * @returns {Server} - socket.io server instance
 */
export const createSocketServer = (): Server => {
	const io = new Server({
		cors: SOCKET_CONFIG.CORS,
		path: SOCKET_CONFIG.PATH,
		transports: ['websocket'],
		pingTimeout: 60000,
		pingInterval: 30000,
		upgradeTimeout: 30000,
		maxHttpBufferSize: 1e7, // 10MB
	});

	io.use((socket, next) => {
		next();
	});

	io.on('connection', (socket) => {
		try {
			const clientId = socket.id;
			logger.info(`Client connected: ${clientId}`);

			/** @todo: get user token from socket query */

			socket.on('message', (data) => {
				logger.info(`Received message from ${clientId}:`, data);
			});

			socket.on('disconnect', () => {
				logger.info(`Client disconnected: ${clientId}`);
			});

			socket.on('error', (error) => {
				logger.error(`Socket error from ${clientId}:`, error);
			});
		} catch (error) {
			logger.error(`:: Socket Connection error:: ${error}`);
		}
	});

	return io;
};
