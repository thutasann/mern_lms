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
		this.usersAtSpecificLevel = this.usersAtSpecificLevel.bind(this);
		this.topFiveUsers = this.topFiveUsers.bind(this);
		this.xpActionMatching = this.xpActionMatching.bind(this);
		this.avgXpPerUser = this.avgXpPerUser.bind(this);
		this.avgXPEarnedByActionType = this.avgXPEarnedByActionType.bind(this);
		this.xpAndCurrency = this.xpAndCurrency.bind(this);
		this.xpGroupedByDate = this.xpGroupedByDate.bind(this);
		this.xpAndLevelWithConditionalFields =
			this.xpAndLevelWithConditionalFields.bind(this);
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
					body: { error: error.message },
				}),
			);
		}
	}

	@catchAsyncErrors()
	public async usersAtSpecificLevel(req: Request, res: Response | any) {
		try {
			const result = await this._xpService.usersAtSpecificLevel(3);
			return res.status(200).json(result);
		} catch (error: any) {
			return res.status(500).json(
				Responer({
					statusCode: 500,
					message: error,
					body: { error: error.message },
				}),
			);
		}
	}

	@catchAsyncErrors()
	public async topFiveUsers(req: Request, res: Response | any) {
		try {
			const result = await this._xpService.topNUsers(5);
			return res.status(200).json(result);
		} catch (error: any) {
			return res.status(500).json(
				Responer({
					statusCode: 500,
					message: error,
					body: { error: error.message },
				}),
			);
		}
	}

	@catchAsyncErrors()
	public async xpActionMatching(req: Request, res: Response | any) {
		try {
			const result = await this._xpService.xpActions();
			return res.status(200).json(result);
		} catch (error: any) {
			return res.status(500).json(
				Responer({
					statusCode: 500,
					message: error,
					body: { error: error.message },
				}),
			);
		}
	}

	@catchAsyncErrors()
	public async avgXpPerUser(req: Request, res: Response | any) {
		try {
			const result = await this._xpService.averageXpPerUser();
			return res.status(200).json(result);
		} catch (error: any) {
			return res.status(500).json(
				Responer({
					statusCode: 500,
					message: error,
					body: { error: error.message },
				}),
			);
		}
	}

	@catchAsyncErrors()
	public async avgXPEarnedByActionType(req: Request, res: Response | any) {
		try {
			const result = await this._xpService.averageXpEarnedByActionType();
			return res.status(200).json(result);
		} catch (error: any) {
			return res.status(500).json(
				Responer({
					statusCode: 500,
					message: error,
					body: { error: error.message },
				}),
			);
		}
	}

	@catchAsyncErrors()
	public async usesWithSpecificXpLevel(req: Request, res: Response | any) {
		try {
			const result = await this._xpService.userWithSpecificXPLevel();
			return res.status(200).json(result);
		} catch (error: any) {
			return res.status(500).json(
				Responer({
					statusCode: 500,
					message: error,
					body: { error: error.message },
				}),
			);
		}
	}

	@catchAsyncErrors()
	public async xpAndCurrency(req: Request, res: Response | any) {
		try {
			const result = await this._xpService.xpAndCurrencyData();
			return res.status(200).json(result);
		} catch (error: any) {
			return res.status(500).json(
				Responer({
					statusCode: 500,
					message: error,
					body: { error: error.message },
				}),
			);
		}
	}

	@catchAsyncErrors()
	public async xpGroupedByDate(req: Request, res: Response | any) {
		try {
			const result = await this._xpService.xpHistoryGroupedByDate();
			return res.status(200).json(result);
		} catch (error: any) {
			return res.status(500).json(
				Responer({
					statusCode: 500,
					message: error,
					body: { error: error.message },
				}),
			);
		}
	}

	@catchAsyncErrors()
	public async xpAndLevelWithConditionalFields(
		req: Request,
		res: Response | any,
	) {
		try {
			const result = await this._xpService.xpAndLevelwithConditionalFeids();
			return res.status(200).json(result);
		} catch (error: any) {
			return res.status(500).json(
				Responer({
					statusCode: 500,
					message: error,
					body: { error: error.message },
				}),
			);
		}
	}
}

const xpService = new XPServices();
export const xpController = new XPController(xpService);
