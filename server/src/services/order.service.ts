import { Response } from 'express';
import mongoose from 'mongoose';
import { CreateOrderRequest } from '../core/dto/order.dto';
import courseModel from '../core/models/course.model';
import userModel from '../core/models/user.model';
import { IUser } from '../core/types/user.type';
import { Responer } from '../core/utils/responer';

export class OrderService {
	public async createOrder(
		userInfo: IUser,
		body: CreateOrderRequest,
		res: Response | any,
	) {
		const { courseId, payment_info } = body;
		const courseObjectId = new mongoose.Types.ObjectId(courseId);
		const user = await userModel.findOne({
			_id: userInfo._id,
		});

		if (!user) {
			return res.status(403).json(
				Responer({
					statusCode: 403,
					message: 'login first',
					devMessage: `you have to login first to order this course`,
					body: {},
				}),
			);
		}

		const courseExistInUser = user?.courses?.some(
			(course) => course._id.toString() === courseId,
		);

		if (courseExistInUser) {
			return res.status(409).json(
				Responer({
					statusCode: 409,
					message: 'already purchased',
					devMessage: `you have already purchased this course`,
					body: {},
				}),
			);
		}

		const course = await courseModel.findOne({
			_id: courseObjectId,
		});
	}
}
