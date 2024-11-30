import { v2 as cloudinary } from 'cloudinary';
import { Server } from 'http';
import mongoose from 'mongoose';
import app from './src/app';
import { connectDB } from './src/core/utils/db';
import {
	seedAssignmentAndGradeData,
	seedBitAndLessonData,
} from './src/core/utils/db/seed';
import { seedXpData } from './src/core/utils/db/seed-xp';
import { logger } from './src/core/utils/logger';

const PORT = process.env.PORT;
let server: Server;

connectDB()
	.then(async () => {
		logger.info(`==> NODE_ENV : ${process.env.NODE_ENV}`);

		// seed data
		await seedBitAndLessonData();
		await seedAssignmentAndGradeData();
		await seedXpData();

		// cloudinary config
		cloudinary.config({
			cloud_name: process.env.CLOUD_NAME,
			api_key: process.env.CLOUD_API_KEY,
			api_secret: process.env.CLOUD_API_SECRET,
		});

		server = app.listen(PORT, () => {
			logger.info(
				`Main Server is listening on http://localhost:${PORT}/api/v1 ✅`,
			);
		});
	})
	.catch((err) => {
		logger.error(`Connect DB Error : ${err}`);
	});

/** Graceful shutdown */
async function gracefulShutdown() {
	try {
		logger.info('Received kill signal, shutting down gracefully');
		server.close();
		logger.info('Server closed');

		await mongoose.connection.close();
		logger.info('Database connection closed successfully');

		process.exit(0);
	} catch (error) {
		logger.error('Error during shutdown:', error);
		process.exit(1);
	}
}

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
