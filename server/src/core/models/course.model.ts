import mongoose, { Model, Schema } from 'mongoose';
import {
	IComment,
	ICourse,
	ICourseData,
	ILink,
	IReview,
} from '../types/course.type';

/** Review Schema */
const reviewSchema = new Schema<IReview>({
	user: Object,
	rating: {
		type: Number,
		default: 0,
	},
	comment: String,
});

/** Link Schema */
const linkSchema = new Schema<ILink>({
	title: String,
	url: String,
});

/** Comment Schema */
const commentSchema = new Schema<IComment>({
	user: Object,
	comment: String,
	commentReplies: [Object],
});

/** Course Data Schema */
const courseDataSchema = new Schema<ICourseData>({
	videoUrl: String,
	videoThumbnail: Object,
	title: String,
	videoSection: String,
	description: String,
	videoLength: Number,
	videoPlayer: String,
	links: [linkSchema],
	suggestion: String,
	questions: [commentSchema],
});

/** Course Schema */
const courseSchema = new Schema<ICourse>({
	name: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	estimatedPrice: {
		type: Number,
	},
	thumbnail: {
		public_id: {
			type: String,
		},
		url: {
			type: String,
		},
	},
	tags: {
		type: String,
		required: true,
	},
	level: {
		type: String,
		required: true,
	},
	demoUrl: {
		type: String,
		required: true,
	},
	benefits: [{ title: String }],
	prerequisites: [{ title: String }],
	reviews: [reviewSchema],
	courseData: [courseDataSchema],
	ratings: {
		type: Number,
		default: 0,
	},
	purchased: {
		type: Number,
		default: 0,
	},
});

const courseModel: Model<ICourse> = mongoose.model<ICourse>(
	'Course',
	courseSchema,
);

export default courseModel;
