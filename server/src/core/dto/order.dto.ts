import { IsObject, IsString } from 'class-validator';

/** create order Request */
export class CreateOrderRequest {
	@IsString()
	courseId: string;

	@IsObject()
	payment_info: object;
}
