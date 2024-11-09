import app from './app';
import { connectDB } from './utils/db';
import { logger } from './utils/logger';

const PORT = process.env.PORT;

connectDB()
	.then(() => {
		app.listen(PORT, () => {
			logger.info(`Main Server is listening on http://localhost:${PORT}`);
		});
	})
	.catch((err) => {
		logger.error(`Connect DB Error : ${err}`);
	});
