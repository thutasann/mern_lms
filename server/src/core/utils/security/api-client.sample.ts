import { xorSecurity } from './xor';

type EncryptedResponse = {
	keyId: string;
	data: string;
};

/** API Client sample to be uesd in client */
class ApiClient {
	private cachedKeys: Map<string, string> = new Map();

	async fetchKeys(): Promise<void> {
		const response = await fetch('/api/keys');
		const keys = await response.json();
		keys.forEach((key: { id: string; key: string }) => {
			this.cachedKeys.set(key.id, key.key);
		});
	}

	async decryptResponse(encryptedResponse: EncryptedResponse): Promise<any> {
		let key = this.cachedKeys.get(encryptedResponse.keyId);

		if (!key) {
			await this.fetchKeys();
			key = this.cachedKeys.get(encryptedResponse.keyId);

			if (!key) {
				throw new Error('Invalid or expired key');
			}
		}

		const decrypted = xorSecurity.xorDecrypt(encryptedResponse);
		return JSON.parse(decrypted);
	}

	async makeRequest(url: string, options: RequestInit = {}): Promise<any> {
		const response = await fetch(url, options);
		const encryptedData: EncryptedResponse = await response.json();
		return this.decryptResponse(encryptedData);
	}
}
