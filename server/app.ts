import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import path from 'path';
import { handleErrorWithLogger } from './src/core/middlewares/errors.middleware';

require('dotenv').config();

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

app.get('/', (req, res) => {
	res.status(200).json({
		success: true,
		message: 'API is working',
	});
});

// not found routes
app.all('*', (req, res) => {
	res.status(404).sendFile(path.join(__dirname, 'public', 'not-found.html'));
});

export default app;
