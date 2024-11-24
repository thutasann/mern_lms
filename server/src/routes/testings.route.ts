import express from 'express';
import { testingController } from '../controllers/testings.controller';
import { responseTimeMiddleware } from '../core/middlewares/response-time.middleware';

/** testing router */
const testingRouter = express.Router();

testingRouter.use(responseTimeMiddleware);

testingRouter.get('/test/find', testingController.findMethod);
testingRouter.get('/test/skip', testingController.skipMethod);
testingRouter.get('/test/limit', testingController.limitMethod);
testingRouter.get('/test/sort', testingController.sortMethod);
testingRouter.get('/test/populate', testingController.populateMethod);

export default testingRouter;
