/**
 * Chat events
 */
export const ChatEvents = {
	SEND_MESSAGE: 'chat:send_message',
	RECEIVE_MESSAGE: 'chat:receive_message',
	JOIN_ROOM: 'chat:join_room',
	LEAVE_ROOM: 'chat:leave_room',
	TYPING: 'chat:typing',
	TYPING_STOP: 'chat:typing_stop',
	USER_ACTIVE: 'User:Active',
} as const;
