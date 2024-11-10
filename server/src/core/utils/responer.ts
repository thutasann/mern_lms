/** Responer Interface */
export interface IResponser<T> {
	statusCode: number;
	message: string;
	devMessage: string;
	body: T;
}

/** Responser */
export const Responer = <T>({
	statusCode,
	message,
	devMessage,
	body,
}: IResponser<T>) => {
	return {
		meta: {
			statusCode,
			success: statusCode >= 200 && statusCode <= 300,
			message,
			devMessage,
		},
		body,
	};
};
