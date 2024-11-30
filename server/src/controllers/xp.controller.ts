import { Request } from 'express';
import { catchAsyncErrors } from '../core/decorators/catcy-async-errrors.decorator';
import { Responer } from '../core/utils/responer';
import { XPServices } from '../services/xp.service';

/**
 * XP Controller
 */
class XPController {
	constructor(private readonly _xpService: XPServices) {
		this.usersAndTotalXP = this.usersAndTotalXP.bind(this);
	}

	@catchAsyncErrors()
	public async usersAndTotalXP(req: Request, res: Response | any) {
		try {
			const result = await this._xpService.usersAndTotalXP();
			return res.status(200).json(result);
		} catch (error: any) {
			return res.status(500).json(
				Responer({
					statusCode: 500,
					message: error,
					devMessage: `Something went wrong in users and total xp`,
					body: { error: error.message },
				}),
			);
		}
	}
}

const xpService = new XPServices();
export const xpController = new XPController(xpService);
