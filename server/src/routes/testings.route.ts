import express from 'express';
import { operatorsController } from '../controllers/tests/operators.controller';
import { testingController } from '../controllers/tests/testings.controller';
import { responseTimeMiddleware } from '../core/middlewares/response-time.middleware';

/** testing router */
const testingRouter = express.Router();

testingRouter.use(responseTimeMiddleware);

testingRouter.get('/test/find', testingController.findMethod);
testingRouter.get('/test/skip', testingController.skipMethod);
testingRouter.get('/test/limit', testingController.limitMethod);
testingRouter.get('/test/sort', testingController.sortMethod);
testingRouter.get('/test/populate', testingController.populateMethod);
testingRouter.get('/test/sample-operators', testingController.sampleOperators);

testingRouter.get('/test/virtual', testingController.virtualMethod);
testingRouter.get('/test/mongoose-method', testingController.mongooseMethod);

testingRouter.get('/test/aggregate-one', testingController.aggregateOne);

// -------- Operators --------

testingRouter.get(
	'/test/operators/upcoming-assignments',
	operatorsController.upcomingAssignments,
);
testingRouter.get(
	'/test/operators/students-with-high-grade',
	operatorsController.studentesWithHighGrades,
);
testingRouter.get(
	'/test/operators/assignments-for-specific-lessons',
	operatorsController.findAssignmentsForSpecificLessons,
);
testingRouter.get(
	'/test/operators/grades-with-feedbacks',
	operatorsController.getGradesWithFeedback,
);
testingRouter.get(
	'/test/operators/assignments-with-pattern',
	operatorsController.getAssignmentsWithPattern,
);
export default testingRouter;
