import { io, Socket } from 'socket.io-client';
import { logger } from '../core/utils/logger';

/**
 * Socket Client Service
 * @description This service is used to connect to the socket server
 */
export class SocketClientService {
	private static instance: SocketClientService;
	private socket: Socket;

	private constructor() {
		this.socket = io(process.env.SOCKET_SERVER_URL || 'ws://localhost:9000', {
			reconnection: true,
			reconnectionDelay: 1000,
			reconnectionDelayMax: 5000,
			reconnectionAttempts: 5,
		});

		this.setupSocketListeners();
	}

	private setupSocketListeners() {
		this.socket.on('connect', () => {
			logger.info('Connected to socket server 🚀');
		});

		this.socket.on('connect_error', (error) => {
			logger.error(`Socket connection error: ${error}`);
		});

		this.socket.on('disconnect', (reason) => {
			logger.warn(`Socket disconnected: ${reason}`);
		});

		this.socket.on('reconnect', (attemptNumber) => {
			logger.info(`Socket reconnected after ${attemptNumber} attempts`);
		});
	}

	public static getInstance(): SocketClientService {
		if (!SocketClientService.instance) {
			SocketClientService.instance = new SocketClientService();
		}
		return SocketClientService.instance;
	}

	public emit(event: string, data: any) {
		if (this.socket.connected) {
			this.socket.emit(event, data);
		} else {
			logger.warn('Socket not connected. Message queued.');
			this.socket.on('connect', () => {
				this.socket.emit(event, data);
			});
		}
	}

	public on(event: string, callback: (data: any) => void) {
		this.socket.on(event, callback);
	}

	public disconnect() {
		this.socket.disconnect();
	}
}
