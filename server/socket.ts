import { v2 as cloudinary } from 'cloudinary';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import { SOCKET_CONFIG } from './src/core/configs/socket.config';
import { connectDB } from './src/core/utils/db';
import { logger } from './src/core/utils/logger';
import { createSocketServer } from './src/socket/socket_app';

let io: Server;
const PORT = Number(SOCKET_CONFIG.PORT);

/** Start socket server */
const startSocketServer = async () => {
	try {
		const socketServer = await createSocketServer();
		io = socketServer.io;

		io.listen(PORT);

		logger.info(`:: Socket server is running on port ${PORT} 🚀 ::`);
	} catch (error) {
		logger.error('Failed to start socket server:', error);
		process.exit(1);
	}
};

/** Shutdown socket server */
const shutdownSocketServer = async () => {
	logger.info('Received shutdown signal. Starting graceful shutdown...');

	try {
		if (io) {
			await io.close();
			logger.info('Socket server closed successfully');
		}

		await mongoose.connection.close();
		logger.info('Database connection closed successfully');

		process.exit(0);
	} catch (error) {
		logger.error('Error during graceful shutdown:', error);
		process.exit(1);
	}
};

/** Register shutdown handlers */
process.on('SIGTERM', shutdownSocketServer);
process.on('SIGINT', shutdownSocketServer);

connectDB()
	.then(() => {
		// cloudinary config
		cloudinary.config({
			cloud_name: process.env.CLOUD_NAME,
			api_key: process.env.CLOUD_API_KEY,
			api_secret: process.env.CLOUD_API_SECRET,
		});

		startSocketServer();
	})
	.catch((err) => {
		logger.error(`Connect DB Error in socket server: ${err}`);
	});
