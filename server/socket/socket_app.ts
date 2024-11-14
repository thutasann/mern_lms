import { Server } from 'socket.io';
import { SOCKET_CONFIG } from '../src/core/configs/socket.config';
import { setupChatGateway } from './gateways/chat.gateway';

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

	// Apply global middleware
	io.use((socket, next) => {
		next();
	});

	// Initialize gateways
	setupChatGateway(io);

	return io;
};
