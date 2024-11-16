import cloudinary from 'cloudinary';
import mongoose from 'mongoose';
import { CACHE_TTL } from '../core/configs/cache.config';
import { CreateCourseRequest } from '../core/dto/course.dto';
import { AddQuestionDataRequest } from '../core/dto/question.dto';
import courseModel from '../core/models/course.model';
import { IComment } from '../core/types/course.type';
import { IUser } from '../core/types/user.type';
import { APIError } from '../core/utils/error/errors';
import { logger } from '../core/utils/logger';
import redis from '../core/utils/redis';
import { Responer } from '../core/utils/responer';

/** Courses Service */
export class CoursesService {
	/** excluded course data */
	private readonly excludeCourseData =
		'-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links';

	constructor() {}

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
			const courses = await courseModel.find().select(this.excludeCourseData);
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

	/** cloudinary upload */
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
