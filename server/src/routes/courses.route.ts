import express from 'express';
import { courseController } from '../controllers/courses.controller';
import {
	authorizeRole,
	isAuthenticated,
} from '../core/middlewares/auth.middleware';
import { responseTimeMiddleware } from '../core/middlewares/response-time.middleware';

/** courses router */
const courseRouter = express.Router();

courseRouter.use(isAuthenticated);
courseRouter.use(authorizeRole('admin'));
courseRouter.use(responseTimeMiddleware);

courseRouter.get('/courses', courseController.getAllCourses);
courseRouter.post('/courses/create', courseController.uploadCourse);
courseRouter.put('/courses/edit/:id', courseController.editCourse);
courseRouter.get('/courses/:id', courseController.getSingleCourse);

export default courseRouter;
