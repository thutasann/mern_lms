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
