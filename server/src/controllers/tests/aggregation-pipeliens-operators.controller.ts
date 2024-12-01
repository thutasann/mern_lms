import { catchAsyncErrors } from '../../core/decorators/catcy-async-errrors.decorator';
import { lessonModel } from '../../core/models/test.model';

class AggregationPipelineController {
	/** `$group` stage in MongoDB aggregation pipelines is used to group documents by a specified key and apply aggregate functions  */
	@catchAsyncErrors()
	public async $groupUsages(req: Request, res: Response | any) {
		try {
			const author_total_lessons = await lessonModel.aggregate([
				{
					$group: {
						_id: '$author',
						totalLessons: { $sum: 1 },
					},
				},
				{
					$lookup: {
						from: 'bits',
						localField: '_id',
						foreignField: '_id',
						as: 'authorDetails',
					},
				},
				{
					$unwind: {
						path: '$authorDetails',
						preserveNullAndEmptyArrays: true,
					},
				},
				{
					$project: {
						_id: 0,
						author: {
							firstName: '$authorDetails.firstName',
							lastName: '$authorDetails.lastName',
						},
						totalLessons: 1,
					},
				},
			]);

			const result = {
				author_total_lessons,
			};
			return res.status(200).json(result);
		} catch (error: any) {
			return res.status(500).json(error);
		}
	}
}

export const aggregationOpeartorController =
	new AggregationPipelineController();
