import cloudinary from 'cloudinary';
import { CreateCourseRequest } from '../core/dto/course.dto';
import courseModel from '../core/models/course.model';
import { APIError } from '../core/utils/error/errors';
import { logger } from '../core/utils/logger';
import { Responer } from '../core/utils/responer';

/** Courses Service */
export class CoursesService {
	constructor() {}

	/** upload course thumbnail to cloudinary */
	public async uploadCourse(thumbnail: string) {
		try {
			if (thumbnail) {
				const myCloud = await this.cloudinaryUpload(undefined, thumbnail);
				return {
					public_id: myCloud.public_id,
					url: myCloud.secure_url,
				};
			}
		} catch (error) {
			throw new APIError(`Error in creating user: ${error}`);
		}
	}

	/** crate course */
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
