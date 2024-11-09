import mongoose from 'mongoose';
import { logger } from '../logger';

/** Connect Database */
export const connectDB = async () => {
	try {
		const mongoURI = process.env.DATABASE_URL || '';
		await mongoose.connect(mongoURI, {}).then(() => {
			logger.info('MongoDB connected 🚀');
		});
	} catch (err: any) {
		logger.error(err.message);
		process.exit(1);
	}
};
