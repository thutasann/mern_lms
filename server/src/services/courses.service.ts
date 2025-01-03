import cloudinary from 'cloudinary';
import mongoose from 'mongoose';
import { CACHE_TTL } from '../core/configs/cache.config';
import {
	AddReplyRequest,
	AddReviewRequest,
	CreateCourseRequest,
} from '../core/dto/course.dto';
import {
	AddAnswerDataRequest,
	AddQuestionDataRequest,
} from '../core/dto/question.dto';
import { FileCache } from '../core/lib/file-cache';
import courseModel from '../core/models/course.model';
import { IComment, IReview } from '../core/types/course.type';
import { IUser } from '../core/types/user.type';
import { APIError } from '../core/utils/error/errors';
import { logger } from '../core/utils/logger';
import redis from '../core/utils/redis';
import { Responer } from '../core/utils/responer';
import { EmailService } from './email.service';

const fileCache = new FileCache({
	cacheDir: 'xpCache',
	ttl: 30,
	namespace: 'courses',
});

/** Courses Service */
export class CoursesService {
	/** excluded course data */
	private readonly excludeCourseData =
		'-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links';

	constructor(private readonly _emailService: EmailService) {}

	/** upload course thumbnail to cloudinary */
	public async uploadCourse(public_id: string | undefined, thumbnail: string) {
		try {
			if (thumbnail) {
				const myCloud = await this.cloudinaryUpload(public_id, thumbnail);
				return {
					public_id: myCloud.public_id,
					url: myCloud.secure_url,
				};
			}
		} catch (error) {
			throw new APIError(`Error in creating user: ${error}`);
		}
	}

	/** create course */
	public async createCourse(body: CreateCourseRequest) {
		try {
			const course = await courseModel.create(body);
			return Responer({
				statusCode: 201,
				devMessage: 'Course create',
				message: `Created course successfully`,
				body: {
					course,
				},
			});
		} catch (error) {
			throw new APIError(`Error in creating course: ${error}`);
		}
	}

	/** edit course */
	public async editCourse(body: CreateCourseRequest, courseId: string) {
		try {
			const course_objectId = new mongoose.Types.ObjectId(courseId);
			const course = await courseModel.findByIdAndUpdate(
				course_objectId,
				{
					$set: body,
				},
				{ new: true },
			);
			return Responer({
				statusCode: 201,
				devMessage: 'Course edit',
				message: `Created edited successfully`,
				body: {
					course,
				},
			});
		} catch (error) {
			throw new APIError(`Error in editing course: ${error}`);
		}
	}

	/** get single course without purchasing */
	public async getSingleCourse(_id: string) {
		try {
			const objectId = new mongoose.Types.ObjectId(_id);

			const redisCache = await redis.get(_id);

			if (redisCache) {
				const course = JSON.parse(redisCache);
				return Responer({
					statusCode: 201,
					devMessage: 'Single Course Without purchase',
					message: `Got Single Course success`,
					body: {
						course,
					},
				});
			} else {
				const course = await courseModel
					.findById(objectId)
					.select(this.excludeCourseData);

				await redis.set(
					_id,
					JSON.stringify(course),
					'EX',
					CACHE_TTL.THIRTY_MINUTES,
				);

				return Responer({
					statusCode: 201,
					devMessage: 'Single Course Without purchase',
					message: `Got Single Course success`,
					body: {
						course,
					},
				});
			}
		} catch (error) {
			throw new APIError(`Error in editing course: ${error}`);
		}
	}

	/** get all courses without purchasing */
	public async getAllCourses() {
		try {
			const cacheKey = 'all-courses';
			const cachedData = await fileCache.get<any>(cacheKey);
			if (cachedData) {
				return Responer({
					statusCode: 200,
					body: {
						cachedData,
					},
				});
			}
			const courses = await courseModel.find().select(this.excludeCourseData);
			await fileCache.set(
				cacheKey,
				Responer({
					statusCode: 200,
					body: {
						courses,
					},
				}),
			);
			return Responer({
				statusCode: 201,
				devMessage: 'Get All courses without purchasing',
				message: `Got all Courses success`,
				body: {
					courses,
				},
			});
		} catch (error) {
			throw new APIError(`Error in getting all courses : ${error}`);
		}
	}

	/** get course content -- only for valid user */
	public async getCourseByUser(courseId: string) {
		try {
			const objectId = new mongoose.Types.ObjectId(courseId);
			const course = await courseModel.findById(objectId);
			const content = course?.courseData;
			return Responer({
				statusCode: 200,
				devMessage: 'get course by user',
				message: `get course by user success`,
				body: {
					content,
				},
			});
		} catch (error) {
			throw new APIError(`Error in getting course by user : ${error}`);
		}
	}

	/** add question */
	public async addQuestion(
		user: IUser,
		body: AddQuestionDataRequest,
		res: Response | any,
	) {
		try {
			const { question, courseId, contentId } = body;
			const courseObjectId = new mongoose.Types.ObjectId(courseId);
			const contentObjectId = new mongoose.Types.ObjectId(contentId);

			const course = await courseModel.findById(courseObjectId);

			if (!course) {
				return res.status(404).json(
					Responer({
						statusCode: 404,
						devMessage: 'course not found',
						message: `course not found`,
						body: {},
					}),
				);
			}

			const courseContent = course?.courseData?.find((item) =>
				(item._id as any).equals(contentObjectId),
			);

			if (!courseContent) {
				return res.status(404).json(
					Responer({
						statusCode: 404,
						devMessage: 'invalid content id',
						message: `content id not found`,
						body: {},
					}),
				);
			}

			const newQuestion: Partial<IComment> = {
				user,
				question,
				questionReplies: [],
			};

			courseContent.questions.push(newQuestion as IComment);

			await course?.save();

			return res.status(201).json(
				Responer({
					statusCode: 201,
					devMessage: 'added question success',
					message: `aded question successfully`,
					body: {
						course,
					},
				}),
			);
		} catch (error) {
			return res.status(500).json(
				Responer({
					statusCode: 500,
					devMessage: 'cannot add question',
					message: `something went wrong at adding question`,
					body: { error },
				}),
			);
		}
	}

	/** add answer to question */
	public async addAnswer(
		user: IUser,
		body: AddAnswerDataRequest,
		res: Response | any,
	) {
		try {
			const { answer, courseId, contentId, questionId } = body;
			const courseObjectId = new mongoose.Types.ObjectId(courseId);
			const contentObjectId = new mongoose.Types.ObjectId(contentId);
			const questionObjectId = new mongoose.Types.ObjectId(questionId);

			const course = await courseModel.findById(courseObjectId);
			if (!course) {
				return res.status(404).json(
					Responer({
						statusCode: 404,
						devMessage: 'course not found',
						message: `course not found`,
						body: {},
					}),
				);
			}

			const courseContent = course?.courseData?.find((item) =>
				(item._id as any).equals(contentObjectId),
			);

			if (!courseContent) {
				return res.status(404).json(
					Responer({
						statusCode: 404,
						devMessage: 'invalid content id',
						message: `content id not found`,
						body: {},
					}),
				);
			}

			const question = courseContent?.questions?.find((item) =>
				(item._id as any).equals(questionId),
			);

			if (!question) {
				return res.status(404).json(
					Responer({
						statusCode: 404,
						devMessage: 'invalid question id',
						message: `question id not found`,
						body: {},
					}),
				);
			}

			const newAnswer = {
				user,
				answer,
			} as Partial<IComment>;

			question.questionReplies.push(newAnswer as IComment);

			await course?.save();

			if (user?._id === question.user._id) {
				/** @todo: create notification */
			} else {
				const data = {
					name: question.user.name,
					title: courseContent.title,
				};

				try {
					await this._emailService.sendEmail({
						email: user.email,
						subject: 'Question Reply',
						tempate: 'question-reply.ejs',
						data,
					});
				} catch (error) {
					logger.error(`Error at sending Question reply email : ${error}`);
				}
			}

			return res.status(201).json(
				Responer({
					statusCode: 201,
					devMessage: 'add answer success',
					message: `aded answer successfully`,
					body: {
						course,
					},
				}),
			);
		} catch (error) {
			return res.status(500).json(
				Responer({
					statusCode: 500,
					devMessage: 'cannot add answer',
					message: `something went wrong at adding answer`,
					body: { error },
				}),
			);
		}
	}

	/** add review to course */
	public async addReview(
		user: IUser,
		courseId: string,
		body: AddReviewRequest,
		res: Response | any,
	) {
		try {
			const { review, rating } = body;
			const courseObjectId = new mongoose.Types.ObjectId(courseId);
			const userCourseList = user?.courses;
			const courseExists = userCourseList?.some(
				(course) => course._id === courseId,
			);

			console.log('courseExists', courseExists);

			if (!courseExists) {
				return res.status(404).json(
					Responer({
						statusCode: 404,
						devMessage: 'not eligible to access this course',
						message: 'you are not eligible to access this course',
						body: {},
					}),
				);
			}

			const course = await courseModel.findOne({
				_id: courseObjectId,
			});

			if (!course) {
				return res.status(404).json(
					Responer({
						statusCode: 404,
						devMessage: 'course not found',
						message: 'course not found',
						body: {},
					}),
				);
			}

			const reviewData = {
				user,
				comment: review,
				rating,
			} as Partial<IReview>;

			course.reviews.push(reviewData as IReview);

			let avg = 0;
			course.reviews.forEach((review) => {
				avg += review.rating;
			});

			course.ratings = avg / course.reviews.length;

			await course.save();

			/** @todo: create notification */
			const notification = {
				title: 'New review received',
				message: `${user?.name} has given a review in ${course.name}`,
			};

			return res.status(201).json(
				Responer({
					statusCode: 201,
					devMessage: 'add review success',
					message: `aded review successfully`,
					body: {
						course,
					},
				}),
			);
		} catch (error) {
			return res.status(500).json(
				Responer({
					statusCode: 500,
					devMessage: 'cannot add review',
					message: `something went wrong at adding review`,
					body: { error },
				}),
			);
		}
	}

	/** add reply to review */
	public async addReplyToReview(
		user: IUser,
		body: AddReplyRequest,
		res: Response | any,
	) {
		try {
			const { comment, courseId, reviewId } = body;
			const courseObjectId = new mongoose.Types.ObjectId(courseId);
			const reviewObjectId = new mongoose.Types.ObjectId(courseId);
			const course = await courseModel.findOne({
				_id: courseObjectId,
			});

			if (!course) {
				return res.status(404).json(
					Responer({
						statusCode: 404,
						devMessage: 'course not found',
						message: 'course not found',
						body: {},
					}),
				);
			}

			const review = course?.reviews.find(
				(rev) => rev?._id?.toString() === reviewId,
			);

			if (!review) {
				return res.status(404).json(
					Responer({
						statusCode: 404,
						devMessage: 'review not found',
						message: 'review not found',
						body: {},
					}),
				);
			}

			const replyData = {
				user,
				comment,
			} as Partial<IComment>;

			if (!review.commentReplies) review.commentReplies = [];

			review.commentReplies.push(replyData as IComment);

			await course.save();

			return res.status(201).json(
				Responer({
					statusCode: 201,
					devMessage: 'add review reply success',
					message: `aded review reply successfully`,
					body: {
						course,
					},
				}),
			);
		} catch (error) {
			return res.status(500).json(
				Responer({
					statusCode: 500,
					devMessage: 'cannot add reply to review',
					message: `something went wrong at adding reply to review`,
					body: { error },
				}),
			);
		}
	}

	/** cloudinary upload @private */
	private async cloudinaryUpload(
		public_id: string | undefined,
		avatar: string,
	) {
		if (public_id) {
			await cloudinary.v2.uploader.destroy(public_id);
		}

		const myCloud = await cloudinary.v2.uploader.upload(
			avatar,
			{
				folder: 'thumbnails',
			},
			(err, result) => {
				if (err) {
					logger.error(`:: Cloudinary Avatar upload error :: ${err}`);
					throw new APIError(`Cloudinary Error: ${err}`);
				}
				if (result) {
					logger.info(`:: Cloudinary Avatar upload success ::`);
				}
			},
		);
		return myCloud;
	}
}
