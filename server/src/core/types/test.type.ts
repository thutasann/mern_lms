import { Document, Types } from 'mongoose';

export interface ILesson extends Document {
	title: string;
	author: Types.ObjectId; // Reference to BIT model
}

export interface IBit extends Document {
	firstName: string;
	lastName: string;
	age: number;
	birthday: Date;
	getFullName: () => string;
}

export interface IAssignment extends Document {
	title: string;
	description: string;
	status: string;
	dueDate: Date;
	lesson: Types.ObjectId;
	createdAt: Date;
}

export interface IGrade extends Document {
	student: Types.ObjectId; // BIT (student) who completed the assignment
	assignment: Types.ObjectId; // Assignment that was graded
	grade: number; // Numeric grade (could be percentage or points)
	feedback: string; // Teacher's feedback
	createdAt: Date;
}
