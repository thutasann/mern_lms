import express from 'express';
import { xpController } from '../controllers/xp.controller';
import { isAuthenticated } from '../core/middlewares/auth.middleware';
import { responseTimeMiddleware } from '../core/middlewares/response-time.middleware';

/** xp router */
const xpRouter = express.Router();

xpRouter.use(isAuthenticated);
xpRouter.use(responseTimeMiddleware);

xpRouter.get('/xps/users-and-total-xp', xpController.usersAndTotalXP);

export default xpRouter;
