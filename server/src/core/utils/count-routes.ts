import { Express } from 'express';
import app from '../../app';
import { logger } from './logger';

/** Count all Routes from Express Server */
export function countRoutes(app: Express) {
	const routes: string[] = [];

	const extractRoutes = (stack: any[]) => {
		stack.forEach((layer) => {
			if (layer.route) {
				const methods = Object.keys(layer.route.methods)
					.map((method) => method.toUpperCase())
					.join(', ');
				routes.push(`${methods} ${layer.route.path}`);
			} else if (layer.handle && layer.handle.stack) {
				extractRoutes(layer.handle.stack);
			}
		});
	};

	extractRoutes(app._router.stack);

	logger.info('\n--- Express Routes ---\n');
	routes.forEach((route, index) => logger.info(`${index + 1}. ${route}`));
	logger.info(`\nTotal Routes: ${routes.length}`);
}

try {
	countRoutes(app);
} catch (error) {
	logger.error(`error at counting routes: ${error}`);
}
