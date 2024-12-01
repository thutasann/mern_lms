import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { logger } from '../core/utils/logger';

class HealthCheckController {
	public async mongoHealth(req: Request, res: Response | any) {
		try {
			const mongoStatus = mongoose.connection.readyState;

			const status = {
				app: 'healthy',
				mongo: mongoStatus === 1 ? 'connected' : 'disconnected',
			};

			const httpStatus = mongoStatus === 1 ? 200 : 500;
			return res.status(httpStatus).json(status);
		} catch (error) {
			logger.error(`Mongo Health check Failed : ${error}`);
			return res.status(500).json({
				error: error,
				message: 'Mongo Health check failed',
			});
		}
	}

	public async pingCheck(req: Request, res: Response | any) {
		try {
			const db = mongoose.connection;
			const pingResult = await db.db?.admin().ping();

			const result = {
				message: 'Ping successful',
				result: pingResult,
			};
			return res.status(200).json(result);
		} catch (error) {
			logger.error(`Ping check Failed : ${error}`);
			return res.status(500).json({
				error: error,
				message: 'Ping failed',
			});
		}
	}
}

export const healthController = new HealthCheckController();
