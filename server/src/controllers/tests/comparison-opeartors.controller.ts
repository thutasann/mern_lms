import { catchAsyncErrors } from '../../core/decorators/catcy-async-errrors.decorator';
import { bitModel } from '../../core/models/test.model';

/**
 * Comparison Operators
 */
class ComparisonControllers {
	@catchAsyncErrors()
	public async $eqUsages(req: Request, res: Response | any) {
		try {
			const firstName = await bitModel.find({ firstName: { $eq: 'John' } });

			const result = {
				firstName,
			};
			return res.status(200).json(result);
		} catch (error: any) {
			return res.status(500).json(error);
		}
	}
}

export const comparisonController = new ComparisonControllers();
