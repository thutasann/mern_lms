import express from 'express';
import { userController } from '../controllers/users.controller';
import { responseTimeMiddleware } from '../core/middlewares/response-time.middleware';

/** users router */
const router = express.Router();

router.post(
	'/users/register',
	responseTimeMiddleware,
	userController.registerUser,
);

export default router;
