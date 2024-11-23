import { Request, Response } from 'express';
import { catchAsyncErrors } from '../core/decorators/catcy-async-errrors.decorator';
import {
	AddReplyRequest,
	AddReviewRequest,
	CreateCourseRequest,
} from '../core/dto/course.dto';
import {
	AddAnswerDataRequest,
	AddQuestionDataRequest,
} from '../core/dto/question.dto';
import { RequestValidator } from '../core/utils/error/request-validator';
import { logger } from '../core/utils/logger';
import { Responer } from '../core/utils/responer';
import { CoursesService } from '../services/courses.service';
import { EmailService } from '../services/email.service';

/** User Controllers */
class CoursesController {
	constructor(private readonly _courseService: CoursesService) {
		this.uploadCourse = this.uploadCourse.bind(this);
		this.editCourse = this.editCourse.bind(this);
		this.getSingleCourse = this.getSingleCourse.bind(this);
		this.getAllCourses = this.getAllCourses.bind(this);
		this.getCourseByUser = this.getCourseByUser.bind(this);
		this.addQuestion = this.addQuestion.bind(this);
		this.addAnswer = this.addAnswer.bind(this);
		this.addReview = this.addReview.bind(this);
		this.addRepyToReview = this.addRepyToReview.bind(this);
	}

	/** upload/create course */
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

	/** edit course */
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

	/** get single course without purchasing */
	@catchAsyncErrors()
	public async getSingleCourse(req: Request, res: Response | any) {
		try {
			const _id = req.params.id;
			const result = await this._courseService.getSingleCourse(_id);
			return res.status(200).json(result);
		} catch (error: any) {
			logger.error(`Errors at Get single course : ${error.message}`);
			return res.status(500).json(
				Responer({
					statusCode: 500,
					message: error,
					devMessage: `Something went wrong in get single Course`,
					body: { error: error.message },
				}),
			);
		}
	}

	/** get all courses without purchasing */
	@catchAsyncErrors()
	public async getAllCourses(req: Request, res: Response | any) {
		try {
			const result = await this._courseService.getAllCourses();
			return res.status(200).json(result);
		} catch (error: any) {
			logger.error(`Errors at Get all courses : ${error.message}`);
			return res.status(500).json(
				Responer({
					statusCode: 500,
					message: error,
					devMessage: `Something went wrong in get all Courses`,
					body: { error: error.message },
				}),
			);
		}
	}

	/** get course content -- only for valid user */
	@catchAsyncErrors()
	public async getCourseByUser(req: Request, res: Response | any) {
		try {
			const courseId = req.params?.id;

			if (!courseId) {
				return res.status(400).json(
					Responer({
						statusCode: 400,
						message: 'Course Id is required',
						devMessage: `Invalid course Id`,
						body: {},
					}),
				);
			}

			const userCourseList = req?.user?.courses || [];
			const courseExists = userCourseList?.find(
				(course) => course._id === courseId,
			);

			if (!courseExists) {
				return res.status(404).json(
					Responer({
						statusCode: 404,
						message: 'Your are not eligible to access this course',
						devMessage: `Not allowed to access this course`,
						body: {},
					}),
				);
			}

			const courseContent = await this._courseService.getCourseByUser(courseId);
			return res.status(200).json(courseContent);
		} catch (error: any) {
			logger.error(`Errors at Get Course By User : ${error.message}`);
			return res.status(500).json(
				Responer({
					statusCode: 500,
					message: error,
					devMessage: `Something went wrong in get course by user`,
					body: { error: error.message },
				}),
			);
		}
	}

	/** add question to course data  */
	@catchAsyncErrors()
	public async addQuestion(req: Request, res: Response | any) {
		const { errors, input } = await RequestValidator(
			AddQuestionDataRequest,
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
			const user = req?.user;
			await this._courseService.addQuestion(user, input, res);
		} catch (error: any) {
			logger.error(`Errors at Adding Question : ${error.message}`);
			return res.status(500).json(
				Responer({
					statusCode: 500,
					message: error,
					devMessage: `Something went wrong in Adding Question`,
					body: { error: error.message },
				}),
			);
		}
	}

	/** add answer in course question */
	@catchAsyncErrors()
	public async addAnswer(req: Request, res: Response | any) {
		const { errors, input } = await RequestValidator(
			AddAnswerDataRequest,
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
			const user = req?.user;
			await this._courseService.addAnswer(user, input, res);
		} catch (error: any) {
			logger.error(`Errors at Adding Question : ${error.message}`);
			return res.status(500).json(
				Responer({
					statusCode: 500,
					message: error,
					devMessage: `Something went wrong in Adding Question`,
					body: { error: error.message },
				}),
			);
		}
	}

	/** add review to course */
	@catchAsyncErrors()
	public async addReview(req: Request, res: Response | any) {
		const { errors, input } = await RequestValidator(
			AddReviewRequest,
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
			const user = req?.user;
			const courseId = req?.params?.id;
			await this._courseService.addReview(user, courseId, input, res);
		} catch (error: any) {
			logger.error(`Errors at Adding Review : ${error.message}`);
			return res.status(500).json(
				Responer({
					statusCode: 500,
					message: error,
					devMessage: `Something went wrong in Adding Question`,
					body: { error: error.message },
				}),
			);
		}
	}

	/** add reply to review */
	@catchAsyncErrors()
	public async addRepyToReview(req: Request, res: Response | any) {
		const { errors, input } = await RequestValidator(AddReplyRequest, req.body);

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
			const user = req?.user;
			await this._courseService.addReplyToReview(user, input, res);
		} catch (error: any) {
			logger.error(`Errors at Adding Revply to Review : ${error.message}`);
			return res.status(500).json(
				Responer({
					statusCode: 500,
					message: error,
					devMessage: `Something went wrong in Adding Question`,
					body: { error: error.message },
				}),
			);
		}
	}
}

const courseService = new CoursesService(new EmailService());
export const courseController = new CoursesController(courseService);
