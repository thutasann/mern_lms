import app from './src/app';
import { connectDB } from './src/core/utils/db';
import { logger } from './src/core/utils/logger';

const PORT = process.env.PORT;

connectDB()
	.then(() => {
		app.listen(PORT, () => {
			logger.info(
				`Main Server is listening on http://localhost:${PORT}/api/v1 ✅`,
			);
		});
	})
	.catch((err) => {
		logger.error(`Connect DB Error : ${err}`);
	});
