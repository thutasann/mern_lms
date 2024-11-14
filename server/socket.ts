import { createSocketServer } from './socket/app';
import { SOCKET_CONFIG } from './src/core/configs/socket.config';
import { connectDB } from './src/core/utils/db';
import { logger } from './src/core/utils/logger';

const PORT = Number(SOCKET_CONFIG.PORT);

const startSocketServer = async () => {
	try {
		const io = createSocketServer();

		io.listen(PORT);

		logger.info(`Socket.IO server is running on port ${PORT} 🚀`);
	} catch (error) {
		logger.error('Failed to start socket server:', error);
		process.exit(1);
	}
};

connectDB()
	.then(() => {
		startSocketServer();
	})
	.catch((err) => {
		logger.error(`Connect DB Error in socket server: ${err}`);
	});
