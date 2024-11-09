import app from './app';
import { logger } from './utils/logger';
require('dotenv').config();

const PORT = process.env.PORT;

app.listen(PORT, () => {
	logger.info(`Main Server is listening on http://localhost:${PORT}`);
});
