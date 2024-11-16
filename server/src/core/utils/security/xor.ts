import { KeyRotationService } from './key-rotation';

type EncryptedPayload = {
	keyId: string;
	data: string;
};

/**
 * XOR Secruity
 */
export class xorSecurity {
	/** encrypt @private */
	private static encrypt(text: string, key: string): string {
		if (!text) return text;

		let result: string = '';
		for (let i = 0; i < text.length; i++) {
			result += String.fromCharCode(
				text.charCodeAt(i) ^ key.charCodeAt(i % key.length),
			);
		}
		return Buffer.from(result).toString('base64');
	}

	/** decrypt @private */
	private static decrypt(encryptedText: string, key: string): string {
		if (!encryptedText) return encryptedText;

		const text = Buffer.from(encryptedText, 'base64').toString();
		let result: string = '';
		for (let i = 0; i < text.length; i++) {
			result += String.fromCharCode(
				text.charCodeAt(i) ^ key.charCodeAt(i % key.length),
			);
		}
		return result;
	}

	/** xor encrypt with rotation key @public */
	public static xorEncrypt(data: string) {
		const keyService = KeyRotationService.getInstance();
		const currentKey = keyService.getCurrentKey();

		return {
			keyId: currentKey.id,
			data: this.encrypt(data, currentKey.key),
		};
	}

	/** xor decrypt with rotation key @public */
	public static xorDecrypt(payload: EncryptedPayload) {
		const keyService = KeyRotationService.getInstance();
		const key = keyService.getKeyById(payload.keyId);

		if (!key) {
			throw new Error('Invalid or expired key ID');
		}

		return this.decrypt(payload.data, key.key);
	}
}
