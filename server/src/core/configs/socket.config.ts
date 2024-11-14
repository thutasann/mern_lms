require('dotenv').config();

export const SOCKET_CONFIG = {
	PORT: process.env.SOCKET_PORT || 9000,
	PATH: '/socket',
	CORS: {
		origin: process.env.CLIENT_URL || 'http://localhost:3000',
		methods: ['GET', 'POST'],
	},
};
