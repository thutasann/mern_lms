import compression from 'compression';
import rateLimit from 'express-rate-limit';

/** Express rate limiter */
export const limiter = rateLimit({
	windowMs: 10 * 60 * 1000,
	limit: 100,
	standardHeaders: 'draft-7',
	legacyHeaders: false,
});

/** Should compress or not */
export const shouldCompress = (
	req: Request | any,
	res: Response | any,
): boolean => {
	if (req.headers['x-no-compression']) {
		return false;
	}
	return compression.filter(req, res);
};
