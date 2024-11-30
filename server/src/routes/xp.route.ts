import express from 'express';
import { xpController } from '../controllers/xp.controller';
import { responseTimeMiddleware } from '../core/middlewares/response-time.middleware';

/** xp router */
const xpRouter = express.Router();

xpRouter.use(responseTimeMiddleware);

xpRouter.get('/xps/users-and-total-xp', xpController.usersAndTotalXP);
xpRouter.get('/xps/users-at-specific-level', xpController.usersAtSpecificLevel);
xpRouter.get('/xps/top-five-users', xpController.topFiveUsers);

export default xpRouter;
