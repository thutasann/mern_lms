import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';

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
