import { Socket } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';

/**
 * Authentication middleware for socket.io
 * @param socket - socket.io socket instance
 * @param next - next middleware function
 */
export const setupAuthMiddleware = (
	socket: Socket,
	next: (err?: ExtendedError) => void,
) => {
	try {
		const token = socket.handshake.auth.token;
		if (!token) {
			throw new Error('Authentication token missing');
		}

		next();
	} catch (error) {
		next(new Error('Authentication failed'));
	}
};
