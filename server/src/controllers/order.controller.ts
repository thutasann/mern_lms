import { NextFunction, Request, Response } from 'express';
import { catchAsyncErrors } from '../core/decorators/catcy-async-errrors.decorator';
import { CreateOrderRequest } from '../core/dto/order.dto';
import { RequestValidator } from '../core/utils/error/request-validator';
import { logger } from '../core/utils/logger';
import { Responer } from '../core/utils/responer';
import { OrderService } from '../services/order.service';

/** Order Controller */
class OrderController {
	constructor(private readonly _orderService: OrderService) {
		this.createOrder = this.createOrder.bind(this);
	}

	@catchAsyncErrors()
	public async createOrder(
		req: Request,
		res: Response | any,
		next: NextFunction,
	) {
		const { errors, input } = await RequestValidator(
			CreateOrderRequest,
			req.body,
		);

		if (errors) {
			return res.status(400).json(
				Responer({
					statusCode: 400,
					message: errors as string,
					devMessage: 'Your Request is invalid',
					body: {},
				}),
			);
		}

		try {
			const user = req?.user;
			return await this._orderService.createOrder(user, input, res);
		} catch (error: any) {
			logger.error(`Errors at create order: ${error.message}`);
			return res.status(500).json(
				Responer({
					statusCode: 500,
					message: error,
					devMessage: `Something went wrong in order`,
					body: { error: error.message },
				}),
			);
		}
	}
}

const orderService = new OrderService();
export const orderController = new OrderController(orderService);
