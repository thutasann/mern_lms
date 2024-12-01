import express from 'express';
import { xpController } from '../controllers/xp.controller';
import { responseTimeMiddleware } from '../core/middlewares/response-time.middleware';

/** xp router */
const xpRouter = express.Router();

xpRouter.use(responseTimeMiddleware);

xpRouter.get('/xps/users-and-total-xp', xpController.usersAndTotalXP);
xpRouter.get('/xps/users-at-specific-level', xpController.usersAtSpecificLevel);
xpRouter.get('/xps/top-five-users', xpController.topFiveUsers);
xpRouter.get('/xps/xp-action-matching', xpController.xpActionMatching);
xpRouter.get('/xps/avg-xp-per-user', xpController.avgXpPerUser);
xpRouter.get(
	'/xps/avg-xp-per-action-type',
	xpController.avgXPEarnedByActionType,
);
xpRouter.get(
	'/xps/users-with-specific-xp-level',
	xpController.usersAtSpecificLevel,
);
xpRouter.get('/xps/xp-and-currency', xpController.xpAndCurrency);
xpRouter.get('/xps/xp-grouped-by-date', xpController.xpGroupedByDate);
xpRouter.get(
	'/xps/xp-and-level-with-conditional-fields',
	xpController.xpAndLevelWithConditionalFields,
);

export default xpRouter;
