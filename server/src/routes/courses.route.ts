import express from 'express';
import { courseController } from '../controllers/courses.controller';
import {
	authorizeRole,
	isAuthenticated,
} from '../core/middlewares/auth.middleware';
import { responseTimeMiddleware } from '../core/middlewares/response-time.middleware';

/** courses router */
const courseRouter = express.Router();

courseRouter.post(
	'/courses/create',
	isAuthenticated,
	authorizeRole('admin'),
	responseTimeMiddleware,
	courseController.uploadCourse,
);

export default courseRouter;
