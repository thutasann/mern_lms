import { xorSecurity } from './security/xor';

export interface IResponser<T> {
	statusCode: number;
	message?: string | unknown;
	devMessage?: string;
	body: T;
}

interface IResponseMeta {
	statusCode: number;
	success: boolean;
	message?: string | unknown;
	devMessage?: string;
}

interface IResponseStructure<T> {
	meta: IResponseMeta;
	body: T;
}

/** Responser */
export const Responer = <T>({
	statusCode,
	message = 'responer message',
	devMessage = 'responer message',
	body,
}: IResponser<T>) => {
	const response: IResponseStructure<T> = {
		meta: {
			statusCode,
			success: statusCode >= 200 && statusCode <= 300,
			message,
			devMessage,
		},
		body,
	};

	const encryptedResponse = xorSecurity.xorEncrypt(JSON.stringify(response));

	return {
		keyId: encryptedResponse.keyId,
		data: encryptedResponse.data,
	};
};
