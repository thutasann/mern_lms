import { NextFunction, Request, Response } from 'express';

/** Catch Async Errors */
export const catchAsyncErrors =
	(func: any) => (req: Request, res: Response, next: NextFunction) => {
		Promise.resolve(func(req, res, next)).catch(next);
	};
