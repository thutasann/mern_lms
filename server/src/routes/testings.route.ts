import express from 'express';
import { testingController } from '../controllers/testings.controller';

/** testing router */
const testingRouter = express.Router();

testingRouter.get('/test/find', testingController.findMethod);
testingRouter.get('/test/skip', testingController.skipMethod);
testingRouter.get('/test/limit', testingController.limitMethod);
testingRouter.get('/test/sort', testingController.sortMethod);

export default testingRouter;
