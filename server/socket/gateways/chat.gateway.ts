import { Server, Socket } from 'socket.io';
import { logger } from '../../src/core/utils/logger';
import { ChatService } from '../services/chat.service';
import {
	ClientToServerEvents,
	InterServerEvents,
	ServerToClientEvents,
	SocketData,
} from '../types/chat.types';

/**
 * Setup chat gateway
 * @param io - socket.io server instance
 */
export const setupChatGateway = (
	io: Server<
		ClientToServerEvents,
		ServerToClientEvents,
		InterServerEvents,
		SocketData
	>,
) => {
	const chatService = new ChatService();

	io.on(
		'connection',
		(
			socket: Socket<
				ClientToServerEvents,
				ServerToClientEvents,
				InterServerEvents,
				SocketData
			>,
		) => {
			try {
				logger.info(`Client connected to chat gateway: ${socket.id}`);

				socket.on('chat:send_message', async (data) => {
					const message = await chatService.handleMessage(data);
					socket.emit('chat:receive_message', message);
				});

				socket.on('chat:join_room', (roomId: string) => {
					socket.join(roomId);
					logger.info(`Client ${socket.id} joined room: ${roomId}`);
				});
			} catch (error) {
				logger.error(`Chat gateway error: ${error}`);
			}
		},
	);
};
