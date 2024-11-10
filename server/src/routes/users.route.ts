import express from 'express';
import { userController } from '../controllers/users.controller';
import { responseTimeMiddleware } from '../core/middlewares/response-time.middleware';

/** users router */
const userRouter = express.Router();

userRouter.post(
	'/users/register',
	responseTimeMiddleware,
	userController.registerUser,
);
userRouter.post('/users/activate', userController.activeUser);

export default userRouter;
