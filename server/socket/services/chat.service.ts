export class ChatService {
	async handleMessage(data: any) {
		return {
			...data,
			timestamp: new Date(),
		};
	}
}
