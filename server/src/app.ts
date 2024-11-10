require('dotenv').config();
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import path from 'path';
import { handleErrorWithLogger } from './core/middlewares/errors.middleware';
import { MAINSERVER_PREFIX } from './core/utils/constants';
import mainRouter from './routes/main.route';
import userRouter from './routes/users.route';

/** main express app */
const app = express();

// middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());
app.use(
	cors({
		origin: process.env.ORIGIN,
	}),
);
app.use(handleErrorWithLogger);

// Routers
app.use(MAINSERVER_PREFIX, mainRouter);
app.use(MAINSERVER_PREFIX, userRouter);

app.all('*', (req, res) => {
	const not_found_path = path.join(
		__dirname,
		'../',
		'public',
		'not-found.html',
	);
	res.status(404).sendFile(not_found_path);
});

export default app;
