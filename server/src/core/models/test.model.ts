import mongoose, { Model, Schema } from 'mongoose';
import { IAssignment, IBit, IGrade, ILesson } from '../types/test.type';

/** bit schema */
const bitSchema = new Schema<IBit>(
	{
		firstName: String,
		lastName: String,
		age: Number,
		birthday: Date,
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
	},
);

/** lesson schema */
const lessonSchema = new Schema<ILesson>(
	{
		title: String,
		author: {
			type: Schema.ObjectId,
			ref: 'BIT',
		},
	},
	{ timestamps: true },
);

/** assignment schema */
const assignmentSchema = new Schema<IAssignment>({
	title: { type: String, required: true },
	description: { type: String, required: true },
	status: { type: String, required: true },
	dueDate: { type: Date, required: true },
	lesson: { type: Schema.Types.ObjectId, ref: 'Lesson', required: true },
	createdAt: { type: Date, default: Date.now },
});

/** grade schema */
const gradeSchema = new Schema<IGrade>({
	student: { type: Schema.Types.ObjectId, ref: 'BIT', required: true },
	assignment: {
		type: Schema.Types.ObjectId,
		ref: 'Assignment',
		required: true,
	},
	grade: { type: Number, required: true },
	feedback: { type: String, required: true },
	createdAt: { type: Date, default: Date.now },
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

/** methods */
bitSchema.methods.getFullName = function () {
	return this.firstName + ' ' + this.lastName;
};

/** middlewares */
bitSchema.pre('save', function (next) {
	(this as any).updatedAt = Date.now();
	next();
});
bitSchema.post('save', function (doc, next) {
	console.log('User Document saved : ', doc);
	next();
});

/** models */
export const bitModel: Model<IBit> = mongoose.model<IBit>('BIT', bitSchema);
export const lessonModel: Model<ILesson> = mongoose.model<ILesson>(
	'Lesson',
	lessonSchema,
);
export const gradeModel: Model<IGrade> = mongoose.model<IGrade>(
	'Grade',
	gradeSchema,
);
export const assignmentModel: Model<IAssignment> = mongoose.model<IAssignment>(
	'Assignment',
	assignmentSchema,
);
