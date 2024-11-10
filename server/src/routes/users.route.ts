import express from 'express';
import { userController } from '../controllers/users.controller';

/** users router */
const userRouter = express.Router();

userRouter.post('/users/register', userController.registerUser);
userRouter.post('/users/activate', userController.activeUser);
userRouter.post('/users/login', userController.loginUser);

export default userRouter;
