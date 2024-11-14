import { v2 as cloudinary } from 'cloudinary';
import { createSocketServer } from './socket/socket_app';
import { SOCKET_CONFIG } from './src/core/configs/socket.config';
import { connectDB } from './src/core/utils/db';
import { logger } from './src/core/utils/logger';

const PORT = Number(SOCKET_CONFIG.PORT);

/** Start socket server */
const startSocketServer = async () => {
	try {
		const io = createSocketServer();

		io.listen(PORT);

		logger.info(`:: Socket server is running on port ${PORT} 🚀 ::`);
	} catch (error) {
		logger.error('Failed to start socket server:', error);
		process.exit(1);
	}
};

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
