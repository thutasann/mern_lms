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
testingRouter.get(
	'/test/operators/assignments-with-grade',
	operatorsController.getAssignmentsWithGradeInfo,
);
testingRouter.get(
	'/test/operators/assignments-with-populated-lessons',
	operatorsController.getAssignmentsWithPopulatedLesson,
);
testingRouter.get(
	'/test/operators/assignments-with-date-lesson',
	operatorsController.getAssignmentsByDateAndLesson,
);
testingRouter.get(
	'/test/operators/assignments-with-filtered-lesson',
	operatorsController.getAssignmentsWithFilteredLesson,
);
testingRouter.get(
	'/test/operators/assignments-with-first-grade',
	operatorsController.getAssignmentsWithFirstGrade,
);
testingRouter.get(
	'/test/operators/assignments-with-lesson-author',
	operatorsController.getAssignmentsWithLessonAndAuthor,
);
testingRouter.get(
	'/test/operators/grades-grouped-by-lesson',
	operatorsController.getGradesGroupedByLesson,
);
testingRouter.get('/test/operators/lookup-one', operatorsController.lookupOne);
testingRouter.get('/test/operators/lookup-two', operatorsController.lookupTwo);
testingRouter.get(
	'/test/operators/match-one',
	operatorsController.getActiveAssignmentsAfterToday,
);
testingRouter.get(
	'/test/operators/average-grade-by-lesson',
	operatorsController.getAverageGradeByLesson,
);
testingRouter.get(
	'/test/operators/first-grade-for-assignments',
	operatorsController.getFirstGradeForAssignments,
);
testingRouter.get(
	'/test/operators/completed-assignment-with-first-grade-by-lesson',
	operatorsController.getCompletedAssignmentsWithFirstGradeByLesson,
);

export default testingRouter;