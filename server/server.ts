import { v2 as cloudinary } from 'cloudinary';
import app from './src/app';
import { connectDB } from './src/core/utils/db';
import { logger } from './src/core/utils/logger';

const PORT = process.env.PORT;

connectDB()
	.then(() => {
		// cloudinary config
		cloudinary.config({
			cloud_name: process.env.CLOUD_NAME,
			api_key: process.env.CLOUD_API_KEY,
			api_secret: process.env.CLOUD_API_SECRET,
		});

		app.listen(PORT, () => {
			logger.info(
				`Main Server is listening on http://localhost:${PORT}/api/v1 ✅`,
			);
		});
	})
	.catch((err) => {
		logger.error(`Connect DB Error : ${err}`);
	});
