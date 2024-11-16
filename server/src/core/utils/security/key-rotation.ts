import { randomBytes } from 'crypto';
import { logger } from '../logger';

type RotationKey = {
	id: string;
	key: string;
	createdAt: Date;
};

/** Key Rotation Service */
export class KeyRotationService {
	private static instance: KeyRotationService;
	private currentKeys: RotationKey[] = [];
	private readonly KEY_LENGTH = 32;
	private readonly MAX_KEYS = 3;
	private readonly ROTATION_INTERVAL = 1000 * 60 * 60; // 1hr

	private constructor() {
		this.addNewKey();

		setInterval(() => this.rotateKeys(), this.ROTATION_INTERVAL);
	}

	/** add new keys @private */
	private addNewKey(): void {
		const newKey: RotationKey = {
			id: randomBytes(8).toString('hex'),
			key: randomBytes(this.KEY_LENGTH).toString('hex'),
			createdAt: new Date(),
		};

		this.currentKeys.unshift(newKey); // Add new key to the beginning

		// Remove oldest keys if we exceed MAX_KEYS
		if (this.currentKeys.length > this.MAX_KEYS) {
			this.currentKeys = this.currentKeys.slice(0, this.MAX_KEYS);
		}
	}

	/** rotate key @private */
	private rotateKeys(): void {
		this.addNewKey();
		logger.info(`Key rotated. Current active keys: ${this.currentKeys.length}`);
	}

	/** get instance @public */
	public static getInstance(): KeyRotationService {
		if (!KeyRotationService.instance) {
			KeyRotationService.instance = new KeyRotationService();
		}
		return KeyRotationService.instance;
	}

	/** get current key @public */
	public getCurrentKey(): RotationKey {
		return this.currentKeys[0];
	}

	/** get key by Id @public */
	public getKeyById(keyId: string): RotationKey | undefined {
		return this.currentKeys.find((k) => k.id === keyId);
	}

	/** get all valid keys @public */
	public getAllValidKeys() {
		return this.currentKeys.map((k) => k);
	}
}
