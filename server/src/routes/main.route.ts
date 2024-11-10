import express from 'express';
import { Responer } from '../core/utils/responer';

/** main router */
const mainRouter = express.Router();

// welcome
mainRouter.get('/', (req, res, next) => {
	res.status(200).json(
		Responer({
			body: 'MERN LMS Server',
			message: 'Welcome to MERN LMS',
			devMessage: 'welcome',
			statusCode: 200,
		}),
	);
});

export default mainRouter;
