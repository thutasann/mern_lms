import express from 'express';
import { courseController } from '../controllers/courses.controller';
import { isAuthenticated } from '../core/middlewares/auth.middleware';

/** courses router */
const courseRouter = express.Router();

courseRouter.post(
	'/courses/create',
	isAuthenticated,
	courseController.uploadCourse,
);

export default courseRouter;
