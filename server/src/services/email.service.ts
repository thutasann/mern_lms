import nodemailer, { Transporter } from 'nodemailer';
import path from 'path';

type EmailOptions = {
	email: string;
	subject: string;
	tempate: string;
	data: {
		[key: string]: any;
	};
};

/**
 * Email Service
 */
export class EmailService {
	async sendEmail<T>(options: EmailOptions): Promise<void> {
		const transport: Transporter = nodemailer.createTransport({
			host: process.env.SMTP_HOST,
			port: process.env.SMTP_PORT,
			service: process.env.SMTP_SERVICE,
			auth: {
				user: process.env.SMTP_MAIL,
				pass: process.env.SMTP_PASSWORD,
			},
		});

		const { email, subject, tempate, data } = options;

		const templatePath = path.join(__dirname, '../email-templates', tempate);
	}
}
