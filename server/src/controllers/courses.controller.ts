import { Request, Response } from 'express';
import { catchAsyncErrors } from '../core/decorators/catcy-async-errrors.decorator';
import { CreateCourseRequest } from '../core/dto/course.dto';
import { RequestValidator } from '../core/utils/error/request-validator';
import { logger } from '../core/utils/logger';
import { Responer } from '../core/utils/responer';
import { CoursesService } from '../services/courses.service';

/** User Controllers */
class CoursesController {
	constructor(private readonly _courseService: CoursesService) {
		this.uploadCourse = this.uploadCourse.bind(this);
		this.editCourse = this.editCourse.bind(this);
	}

	@catchAsyncErrors()
	public async uploadCourse(req: Request, res: Response | any) {
		const { errors, input } = await RequestValidator(
			CreateCourseRequest,
			req.body,
		);

		if (errors) {
			return res.status(400).json(
				Responer({
					statusCode: 400,
					message: errors as string,
					devMessage: 'Your Request is invalid',
					body: {},
				}),
			);
		}

		try {
			if (input?.thumbnail) {
				const upload_result = await this._courseService.uploadCourse(
					undefined,
					input.thumbnail as string,
				);

				if (upload_result) {
					input.thumbnail = {
						public_id: upload_result.public_id,
						url: upload_result.url,
					};
				} else {
					input.thumbnail = '';
				}
			}
			const result = await this._courseService.createCourse(input);
			return res.status(201).json(result);
		} catch (error: any) {
			logger.error(`Errors at upload course : ${error.message}`);
			return res.status(500).json(
				Responer({
					statusCode: 500,
					message: error,
					devMessage: `Something went wrong in Upload Course`,
					body: { error: error.message },
				}),
			);
		}
	}

	@catchAsyncErrors()
	public async editCourse(req: Request, res: Response | any) {
		const { errors, input } = await RequestValidator(
			CreateCourseRequest,
			req.body,
		);

		if (errors) {
			return res.status(400).json(
				Responer({
					statusCode: 400,
					message: errors as string,
					devMessage: 'Your Request is invalid',
					body: {},
				}),
			);
		}

		try {
			if (input?.thumbnail) {
				const public_id = (input?.thumbnail as any)?.public_id;

				const upload_result = await this._courseService.uploadCourse(
					public_id,
					input.thumbnail as string,
				);

				if (upload_result) {
					input.thumbnail = {
						public_id: upload_result.public_id,
						url: upload_result.url,
					};
				} else {
					input.thumbnail = '';
				}
			}

			const courseId = req.params.id;
			const result = await this._courseService.editCourse(input, courseId);
			return res.status(201).json(result);
		} catch (error: any) {
			logger.error(`Errors at Edit course : ${error.message}`);
			return res.status(500).json(
				Responer({
					statusCode: 500,
					message: error,
					devMessage: `Something went wrong in Edit Course`,
					body: { error: error.message },
				}),
			);
		}
	}
}

const courseService = new CoursesService();
export const courseController = new CoursesController(courseService);
