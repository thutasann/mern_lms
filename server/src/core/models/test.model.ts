import mongoose, { Schema } from 'mongoose';

const bitSchema = new Schema({
	firstName: String,
	lastName: String,
	age: Number,
	birthday: Date,
});

const lessonSchema = new Schema({
	title: String,
	author: {
		type: Schema.ObjectId,
		ref: 'BIT',
	},
});

export const bitModel = mongoose.model('BIT', bitSchema);
export const lessonModel = mongoose.model('Lesson', lessonSchema);
