declare namespace NodeJS {
	export interface ProcessEnv {
		PORT: string | undefined;
		ORIGIN: string[];
		DATABASE_URL: string;
		CLOUD_NAME: string;
		CLOUD_API_KEY: string;
		CLOUD_API_SECRET: string;
	}
}
