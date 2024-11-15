import { IUser } from '../../core/types/user.type';
import { ChatEvents } from '../events/chat.events';

/**
 * Server to client events
 * @description Events emitted by the server to the client
 */
export interface ServerToClientEvents {
	[ChatEvents.RECEIVE_MESSAGE]: (message: any) => void;
}

/**
 * Client to server events
 * @description Events emitted by the client to the server
 */
export interface ClientToServerEvents {
	[ChatEvents.SEND_MESSAGE]: (data: {
		roomId: string;
		[key: string]: any;
	}) => void;
	[ChatEvents.JOIN_ROOM]: (roomId: string) => void;
	[ChatEvents.USER_ACTIVE]: (user: IUser) => void;
}

/**
 * Inter-server events
 * @description Events emitted by the server to the server
 */
export interface InterServerEvents {
	ping: () => void; // Example inter-server event
}

/**
 * Socket data
 * @description Data attached to the socket
 */
export interface SocketData {
	userId?: string;
	username?: string;
}
