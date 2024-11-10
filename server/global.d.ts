declare namespace NodeJS {
	export interface ProcessEnv {
		// Nodejs
		PORT: string | undefined;
		ORIGIN: string[];
		NODE_ENV: 'development' | 'production';

		// Database
		DATABASE_URL: string;

		// Cloudinary
		CLOUD_NAME: string;
		CLOUD_API_KEY: string;
		CLOUD_API_SECRET: string;

		// Redis
		REDIS_URL: string;

		// JWT
		JWT_SECRET: string;

		// Email Service
		SMTP_HOST: string;
		SMTP_PORT: string;
		SMTP_SERVICE: string;
		SMTP_MAIL: string;
		SMTP_PASSWORD: string;
	}
}
