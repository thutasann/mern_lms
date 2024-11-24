import { Request, Response } from 'express';
import { catchAsyncErrors } from '../../core/decorators/catcy-async-errrors.decorator';
import courseModel from '../../core/models/course.model';
import { bitModel, lessonModel } from '../../core/models/test.model';
import { logger } from '../../core/utils/logger';

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

	@catchAsyncErrors()
	public async populateMethod(req: Request, res: Response | any) {
		try {
			const result = await lessonModel
				.findOne({
					title: { $regex: 'Mas' },
				})
				.populate('author');
			return res.status(200).json(result);
		} catch (error: any) {
			return res.status(500).json(error);
		}
	}

	@catchAsyncErrors()
	public async aggregateOne(req: Request, res: Response | any) {
		try {
			const result = await bitModel.aggregate([
				{
					$match: { age: { $gte: 30 } },
				},
				{ $sort: { total: -1 } },
			]);
			return res.status(200).json(result);
		} catch (error: any) {
			logger.error('error ' + error);
			return res.status(500).json(error);
		}
	}

	@catchAsyncErrors()
	public async virtualMethod(req: Request, res: Response | any) {
		try {
			const result = (await bitModel.findOne({ firstName: 'John' })) as any;
			return res.status(200).json(result.fullname);
		} catch (error: any) {
			logger.error('error ' + error);
			return res.status(500).json(error);
		}
	}

	@catchAsyncErrors()
	public async mongooseMethod(req: Request, res: Response | any) {
		try {
			const result = await bitModel.findOne({
				firstName: 'Charlie',
			});
			return res.status(200).json(result?.getFullName());
		} catch (error: any) {
			return res.status(500).json(error);
		}
	}

	@catchAsyncErrors()
	public async sampleOperators(req: Request, res: Response | any) {
		try {
			const authors = await bitModel.find({ firstName: { $regex: /john/i } });
			const ageRange = await bitModel.find({
				age: {
					$gte: 18,
					$lte: 50,
				},
			});
			const response = {
				authors,
				ageRange,
			};
			return res.status(200).json(response);
		} catch (error: any) {
			return res.status(500).json(error);
		}
	}
}

export const testingController = new TestingController();
