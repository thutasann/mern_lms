import { catchAsyncErrors } from '../../core/decorators/catcy-async-errrors.decorator';
import { assignmentModel, gradeModel } from '../../core/models/test.model';
import { XpLevelSetting } from '../../core/models/xp-level-settings.model';

/**
 * Evaluation Opeartors Controller
 */
class EvaluationOpeartors {
	/** `$expr` operator allows you to use aggregation expressions within a query filter. It provides a way to perform comparisons and calculations using document fields and values at query time, making it highly versatile for dynamic queries. */
	@catchAsyncErrors()
	public async $exprUsages(req: Request, res: Response | any) {
		try {
			const xpLevels_grater_than_500 = await XpLevelSetting.find({
				$expr: {
					$gte: ['$requiredXp', 500],
				},
			});

			const total_possible_grade = await gradeModel.find({
				$expr: {
					$gte: ['$grade', { $divide: ['$totalPossibleGrade', 2] }],
				},
			});

			const late_submissions = await assignmentModel.find({
				$expr: {
					$lt: ['$dueDate', '$createdAt'],
				},
			});

			const result = {
				late_submissions,
				total_possible_grade,
				xpLevels_grater_than_500,
			};
			return res.status(200).json(result);
		} catch (error: any) {
			return res.status(500).json(error);
		}
	}
}

export const evaluationOperator = new EvaluationOpeartors();
