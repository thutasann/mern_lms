import { Request, Response } from 'express';
import { catchAsyncErrors } from '../core/decorators/catcy-async-errrors.decorator';
import courseModel from '../core/models/course.model';
import { logger } from '../core/utils/logger';

/**
 *  Mongoose Testing Controller
 * @description this is just the testing controller to explore mongoose queires
 */
class TestingController {
	@catchAsyncErrors()
	public async findMethod(req: Request, res: Response | any) {
		try {
			const result = await courseModel.find().exec();
			return res.status(200).json(result);
		} catch (error: any) {
			return res.status(500).json(error);
		}
	}

	@catchAsyncErrors()
	public async skipMethod(req: Request, res: Response | any) {
		try {
			const result = await courseModel.find().skip(1);
			return res.status(200).json(result);
		} catch (error: any) {
			return res.status(500).json(error);
		}
	}

	@catchAsyncErrors()
	public async limitMethod(req: Request, res: Response | any) {
		try {
			const result = await courseModel.find().limit(3);
			logger.info(`result length : ${result.length}`);
			return res.status(200).json(result);
		} catch (error: any) {
			return res.status(500).json(error);
		}
	}

	@catchAsyncErrors()
	public async sortMethod(req: Request, res: Response | any) {
		try {
			const result = await courseModel.find().sort({
				name: 'desc',
			});
			return res.status(200).json(result);
		} catch (error: any) {
			return res.status(500).json(error);
		}
	}
}

export const testingController = new TestingController();
