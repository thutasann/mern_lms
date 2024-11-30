import { NextFunction, Request, Response } from 'express';
import { KeyRotationService } from './key-rotation';
import { xorSecurity } from './xor';

/**
 * Development Environment Decryptor Middleware
 */
export const developmentDecryptor = () => {
	return (req: Request, res: Response, next: NextFunction) => {
		const originalJson = res.json;

		// Override the json method
		res.json = function (body: any) {
			if (body?.keyId && body?.data) {
				const keyService = KeyRotationService.getInstance();
				const key = keyService.getKeyById(body.keyId);

				if (key) {
					const decryptedData = xorSecurity.xorDecrypt(body);

					// In development, return both encrypted and decrypted data
					const devResponse = {
						_decrypted: JSON.parse(decryptedData),
						_encrypted: body,
						_developmentMode: true,
					};

					return originalJson.call(this, devResponse);
				}
			}

			return originalJson.call(this, body);
		};

		next();
	};
};
