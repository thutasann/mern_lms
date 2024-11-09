import mongoose, { ConnectOptions } from 'mongoose';
import { logger } from '../logger';

/** Connect Database */
export const connectDB = async (retries = 5) => {
	const mongoURI = process.env.DATABASE_URL;

	if (!mongoURI) {
		logger.error('MongoDB connection URL not provided');
		process.exit(1);
	}

	const options: ConnectOptions = {
		maxPoolSize: 50,
	};

	while (retries) {
		try {
			await mongoose.connect(mongoURI, options);
			logger.info('MongoDB connected successfully 🚀');

			mongoose.connection.on('error', (error) => {
				logger.error('MongoDB connection error:', error);
			});

			mongoose.connection.on('disconnected', () => {
				logger.warn('MongoDB disconnected. Attempting to reconnect...');
			});
			return;
		} catch (error) {
			retries -= 1;
			logger.error(`MongoDB connection attempt failed: ${error}`);

			if (retries === 0) {
				logger.error('Failed to connect to MongoDB after multiple retries');
				process.exit(1);
			}

			await new Promise((resolve) => setTimeout(resolve, 5000));
		}
	}
};
