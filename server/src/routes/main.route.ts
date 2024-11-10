import express from 'express';
import path from 'path';
import { MAINSERVER_PREFIX } from '../core/utils/constants';
import { Responer } from '../core/utils/responer';

/** main router */
const mainRouter = express.Router();

mainRouter.get('/', (req, res) => {
	return res.redirect(301, MAINSERVER_PREFIX);
});

// welcome
mainRouter.get(MAINSERVER_PREFIX, (req, res, next) => {
	res.status(200).json(
		Responer({
			body: 'MERN LMS Server',
			message: 'Welcome to MERN LMS',
			devMessage: 'welcome',
			statusCode: 200,
		}),
	);
});

// not found routes
mainRouter.all('*', (req, res) => {
	res
		.status(404)
		.sendFile(path.join(__dirname, '../../', 'public', 'not-found.html'));
});

export default mainRouter;
