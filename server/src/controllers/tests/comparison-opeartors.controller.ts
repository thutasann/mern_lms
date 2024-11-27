import mongoose from 'mongoose';
import { catchAsyncErrors } from '../../core/decorators/catcy-async-errrors.decorator';
import {
	assignmentModel,
	bitModel,
	gradeModel,
	lessonModel,
} from '../../core/models/test.model';

/**
 * Comparison Operators
 */
class ComparisonControllers {
	/** `$eq` is a query operator used to match documents where the value of a field equals a specified value. */
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

	/** The `$ne` operator to match documents where a specified field is not equal to a given value  */
	@catchAsyncErrors()
	public async $neUsages(req: Request, res: Response | any) {
		try {
			const ne_sample = await bitModel.find({
				firstName: { $ne: 'Jane' },
			});

			const object_id_ne_sample = await assignmentModel.find({
				lesson: { $ne: '67471d8d8e9182abc9419bc4' },
			});

			const active_assignments = await assignmentModel.aggregate([
				{
					$match: {
						$expr: {
							$ne: ['$status', 'in-active'],
						},
					},
				},
			]);

			const fitlered_nested_arrays = await lessonModel.aggregate([
				{
					$lookup: {
						from: 'assignments',
						localField: '_id',
						foreignField: 'lesson',
						as: 'assignments',
					},
				},
				{
					$match: {
						'assignments.status': { $ne: 'in-active' },
					},
				},
			]);

			const conditional_projection = await assignmentModel.aggregate([
				{
					$project: {
						title: 1,
						isActive: {
							$ne: ['status', 'in-active'],
						},
					},
				},
			]);

			const exclude_matching_documents_in_lookup = await bitModel.aggregate([
				{
					$lookup: {
						from: 'grades',
						let: { studentId: '$_id' },
						pipeline: [
							{
								$match: {
									$expr: {
										$and: [
											{ $eq: ['$student', '$$studentId'] },
											{ $ne: ['$grade', 100] }, // Exclude grades that are exactly 100
										],
									},
								},
							},
						],
						as: 'nonPerfetctGrades',
					},
				},
			]);

			const result = {
				ne_sample,
				object_id_ne_sample,
				active_assignments,
				fitlered_nested_arrays,
				conditional_projection,
				exclude_matching_documents_in_lookup,
			};
			return res.status(200).json(result);
		} catch (error) {
			return res.status(500).json(error);
		}
	}
}

export const comparisonController = new ComparisonControllers();
