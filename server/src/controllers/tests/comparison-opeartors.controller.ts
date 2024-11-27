import mongoose from 'mongoose';
import { catchAsyncErrors } from '../../core/decorators/catcy-async-errrors.decorator';
import {
	assignmentModel,
	bitModel,
	gradeModel,
} from '../../core/models/test.model';

/**
 * Comparison Operators
 */
class ComparisonControllers {
	@catchAsyncErrors()
	public async $eqUsages(req: Request, res: Response | any) {
		try {
			const firstName = await bitModel.find({ lastName: { $eq: 'Dave' } });

			const assignment_aggregated = await assignmentModel.aggregate([
				{
					$match: {
						$expr: {
							$eq: [
								'$lesson',
								new mongoose.Types.ObjectId('67471d663a272515052e1e1c'),
							],
						},
					},
				},
			]);

			const grades_aggregated = await gradeModel.aggregate([
				{
					$match: {
						$expr: {
							$and: [
								{
									$eq: [
										'$student',
										new mongoose.Types.ObjectId('67471d663a272515052e1db8'),
									],
								},
								{
									$eq: [
										'$assignment',
										new mongoose.Types.ObjectId('67471d8d8e9182abc9419bc5'),
									],
								},
							],
						},
					},
				},
			]);

			const assignment_projected = await assignmentModel.aggregate([
				{
					$project: {
						title: 1,
						isActive: {
							$eq: ['$status', 'active'],
						},
					},
				},
			]);

			const result = {
				firstName,
				assignment_aggregated,
				grades_aggregated,
				assignment_projected,
			};
			return res.status(200).json(result);
		} catch (error: any) {
			return res.status(500).json(error);
		}
	}
}

export const comparisonController = new ComparisonControllers();
