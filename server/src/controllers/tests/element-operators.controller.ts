import { catchAsyncErrors } from '../../core/decorators/catcy-async-errrors.decorator';
import { CurrencyHistory } from '../../core/models/currency.model';
import { UserXps } from '../../core/models/user-xp.model';
import { XpHistory } from '../../core/models/xp-history.model';

/**
 * Element Operators Controller
 */
class ElementOperatorsController {
	/** `$exists` operator in MongoDB is used to query documents to check whether a specific field exists or not. */
	@catchAsyncErrors()
	public async $existsUsages(req: Request, res: Response | any) {
		try {
			const [xpHistory, currencyHistory] = await Promise.all([
				XpHistory.find({
					xpAwarded: { $exists: true },
				}),

				CurrencyHistory.find({
					amount: { $exists: true },
				}),
			]);

			const result = {
				xpHistory,
				currencyHistory,
			};

			return res.status(200).json(result);
		} catch (error) {
			return res.status(500).json(error);
		}
	}

	/** `$type` operator matches documents based on the BSON type of a field. */
	@catchAsyncErrors()
	public async $typeUsages(req: Request, res: Response | any) {
		try {
			const numericXPRecords = await XpHistory.find({
				xpAwarded: { $type: 'number' },
			});

			const stringCurrencyRecords = await CurrencyHistory.find({
				amount: { $type: 'string' },
			});

			const userWithObjectId = await UserXps.find({
				user: { $type: 'objectId' },
			});

			const xpWithDate = await XpHistory.find({
				date: { $type: 'date' },
			});

			const result = {
				numericXPRecords,
				stringCurrencyRecords,
				userWithObjectId,
				xpWithDate,
			};

			return res.status(200).json(result);
		} catch (error) {
			return res.status(500).json(error);
		}
	}
}

export const elementOperatorsController = new ElementOperatorsController();
