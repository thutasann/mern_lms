import mongoose, { Model, Schema } from 'mongoose';
import { IBit, ILesson } from '../types/test.type';

/** bit schema */
const bitSchema = new Schema<IBit>(
	{
		firstName: String,
		lastName: String,
		age: Number,
		birthday: Date,
	},
	{
		toJSON: { virtuals: true },
	},
);

/** lesson schema */
const lessonSchema = new Schema<ILesson>({
	title: String,
	author: {
		type: Schema.ObjectId,
		ref: 'BIT',
	},
});

/** bit schema virtual */
const bitSchemaVirtual = bitSchema.virtual('fullname');
bitSchemaVirtual.get(function () {
	return this.firstName + ' ' + this.lastName;
});
bitSchemaVirtual.set(function (name: string) {
	let split = name.split(' ');
	this.firstName = split[0];
	this.lastName = split[1];
});

export const bitModel: Model<IBit> = mongoose.model<IBit>('BIT', bitSchema);
export const lessonModel: Model<ILesson> = mongoose.model<ILesson>(
	'Lesson',
	lessonSchema,
);
