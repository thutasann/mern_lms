import express from 'express';
import { Responer } from '../core/utils/responer';
import { KeyRotationService } from '../core/utils/security/key-rotation';

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

mainRouter.get('/keys', (req, res: any) => {
	const keyService = KeyRotationService.getInstance();
	return res.status(200).json(keyService.getAllValidKeys());
});

export default mainRouter;
