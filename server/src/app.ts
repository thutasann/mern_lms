require('dotenv').config();
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import path from 'path';
import { handleErrorWithLogger } from './core/middlewares/errors.middleware';
import { MAINSERVER_PREFIX } from './core/utils/constants';
import { limiter, shouldCompress } from './core/utils/middleware-utils';
import { developmentDecryptor } from './core/utils/security/development-decryptor';
import courseRouter from './routes/courses.route';
import mainRouter from './routes/main.route';
import orderRouter from './routes/order.route';
import testingRouter from './routes/testings.route';
import userRouter from './routes/users.route';

/** main express app */
const app = express();

// middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
	cors({
		origin: process.env.ORIGIN,
	}),
);
app.use(limiter);
app.use(handleErrorWithLogger);
app.use(
	compression({
		level: 6,
		threshold: 50 * 1000,
		filter: shouldCompress,
	}),
);
if (process.env.NODE_ENV === 'development') app.use(developmentDecryptor());

// Routers
app.use(MAINSERVER_PREFIX, mainRouter);
app.use(MAINSERVER_PREFIX, userRouter);
app.use(MAINSERVER_PREFIX, courseRouter);
app.use(MAINSERVER_PREFIX, orderRouter);
app.use(MAINSERVER_PREFIX, testingRouter);

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
