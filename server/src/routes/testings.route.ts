import express from 'express';
import { testingController } from '../controllers/testings.controller';

/** testing router */
const testingRouter = express.Router();

testingRouter.get('/test/find', testingController.findMethod);

export default testingRouter;
