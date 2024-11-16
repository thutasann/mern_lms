import { IsString } from 'class-validator';

export class AddQuestionDataRequest {
	@IsString()
	question: string;

	@IsString()
	courseId: string;

	@IsString()
	contentId: string;
}
