import express from 'express';
import { userCRUDController } from '../controllers/users-crud.controller';
import { userController } from '../controllers/users.controller';
import { isAuthenticated } from '../core/middlewares/auth.middleware';

/** users router */
const userRouter = express.Router();

userRouter.post('/users/register', userController.registerUser);
userRouter.post('/users/activate', userController.activeUser);
userRouter.post('/users/login', userController.loginUser);
userRouter.post('/users/social', userController.socialAuth);
userRouter.post('/users/logout', isAuthenticated, userController.logoutUser);
userRouter.post(
	'/users/refresh-token',
	isAuthenticated,
	userController.updateAccessToken,
);
userRouter.get('/users/get', isAuthenticated, userController.getUserById);
userRouter.put('/users/update', isAuthenticated, userCRUDController.updateUser);
userRouter.put(
	'/users/update-password',
	isAuthenticated,
	userCRUDController.updateUserPasasword,
);

export default userRouter;
