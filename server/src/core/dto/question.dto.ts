import { IsString } from 'class-validator';

/** Add Question data to courseContent Request */
export class AddQuestionDataRequest {
	@IsString()
	question: string;

	@IsString()
	courseId: string;

	@IsString()
	contentId: string;
}

/** Add Answer to course content and question Request */
export class AddAnswerDataRequest {
	@IsString()
	answer: string;

	@IsString()
	courseId: string;

	@IsString()
	contentId: string;

	@IsString()
	questionId: string;
}
