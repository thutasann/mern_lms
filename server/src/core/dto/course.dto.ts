import { IsArray, IsNumber, IsString } from 'class-validator';

/** Thumbnail */
export class Thumbnail {
	@IsString({ message: 'public_id must be a string' })
	public_id: string;

	@IsString({ message: 'url must be a string' })
	url: string;
}

type CourseDataRequest = {
	videoUrl: string;
	title: string;
	videoSection: string;
	description: string;
	videoLength: 12;
	links: {
		title: string;
		url: string;
	}[];
};

/** Create Course Request */
export class CreateCourseRequest {
	@IsString()
	name: string;

	@IsString()
	description: string;

	@IsNumber()
	price: number;

	@IsNumber()
	estimatedPrice: number;

	@IsString()
	tags: string;

	@IsString()
	level: string;

	@IsString()
	demoUrl: string;

	@IsArray()
	benefits: Array<{ title: string }>;

	@IsArray()
	prerequisites: Array<{ title: string }>;

	@IsArray()
	courseData: CourseDataRequest[];

	thumbnail?:
		| string
		| {
				public_id: string;
				url: string;
		  };
}

/** Add Review Request */
export class AddReviewRequest {
	@IsString()
	review: string;

	@IsNumber()
	rating: number;
}
