import ejs from 'ejs';
import nodemailer, { Transporter } from 'nodemailer';
import path from 'path';
import { APIError } from '../core/utils/error/errors';

type EmailOptions = {
	email: string;
	subject: string;
	tempate: string;
	data: {
		[key: string]: any;
	};
};

/**
 * Email Service using nodemailer
 */
export class EmailService {
	/**
	 * Send email using nodemailer and ejs
	 * @param options - email options
	 */
	async sendEmail<T>(options: EmailOptions): Promise<void> {
		try {
			const transport: Transporter = nodemailer.createTransport({
				host: process.env.SMTP_HOST,
				port: parseInt(process.env.SMTP_PORT || '465'),
				service: process.env.SMTP_SERVICE,
				auth: {
					user: process.env.SMTP_MAIL,
					pass: process.env.SMTP_PASSWORD,
				},
			});

			const { email, subject, tempate, data } = options;
			const templatePath = path.join(__dirname, '../email-templates', tempate);
			const html: string = await ejs.renderFile(templatePath, data);

			const mailOptions = {
				from: process.env.SMTP_MAIL,
				to: email,
				subject,
				html,
			};

			await transport.sendMail(mailOptions);
		} catch (error) {
			throw new APIError(`Error in sending email : ${error}`);
		}
	}
}
