import { logger } from '../../src/core/utils/logger';

export class ChatService {
	async handleMessage(data: any) {
		logger.info(`handleMessage : ${data}`);

		return {
			...data,
			timestamp: new Date(),
		};
	}
}
