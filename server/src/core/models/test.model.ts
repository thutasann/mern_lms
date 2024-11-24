import mongoose, { Model, Schema } from 'mongoose';
import { IBit, ILesson } from '../types/test.type';

const bitSchema = new Schema<IBit>({
	firstName: String,
	lastName: String,
	age: Number,
	birthday: Date,
});

const lessonSchema = new Schema<ILesson>({
	title: String,
	author: {
		type: Schema.ObjectId,
		ref: 'BIT',
	},
});

export const bitModel: Model<IBit> = mongoose.model<IBit>('BIT', bitSchema);
export const lessonModel: Model<ILesson> = mongoose.model<ILesson>(
	'Lesson',
	lessonSchema,
);
