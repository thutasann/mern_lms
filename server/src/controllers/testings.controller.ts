import { Request, Response } from 'express';
import { catchAsyncErrors } from '../core/decorators/catcy-async-errrors.decorator';
import courseModel from '../core/models/course.model';
import { logger } from '../core/utils/logger';
import { Responer } from '../core/utils/responer';

/** Mongoose Testing Controller */
class TestingController {
	@catchAsyncErrors()
	public async findMethod(req: Request, res: Response | any) {
		try {
			const result = await courseModel.find();
			return res.status(200).json(result);
		} catch (error: any) {
			logger.error(`Errors at upload course : ${error.message}`);
			return res.status(500).json(
				Responer({
					statusCode: 500,
					message: error,
					devMessage: `Something went wrong in get Courses`,
					body: { error: error.message },
				}),
			);
		}
	}
}

export const testingController = new TestingController();
