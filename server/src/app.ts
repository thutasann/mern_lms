import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import path from 'path';
import { handleErrorWithLogger } from './core/middlewares/errors.middleware';
import { MAINSERVER_PREFIX } from './core/utils/constants';
import { Responer } from './core/utils/responer';
import userRouter from './routes/users.route';

require('dotenv').config();

/** main express app */
const app = express();

// middlewares
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());
app.use(
	cors({
		origin: process.env.ORIGIN,
	}),
);
app.use(handleErrorWithLogger);

app.use(MAINSERVER_PREFIX, userRouter);

app.get(MAINSERVER_PREFIX, (req, res, next) => {
	res.status(200).json(
		Responer({
			body: 'MERN LMS Server',
			message: 'Welcome to MERN LMS',
			devMessage: 'welcome',
			statusCode: 200,
		}),
	);
});

app.post('/faldaf', (req, res, next) => {});

// not found routes
app.all('*', (req, res) => {
	res
		.status(404)
		.sendFile(path.join(__dirname, '../', 'public', 'not-found.html'));
});

export default app;
