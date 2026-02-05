import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "e6aa075c2bc50e",
                pass: "9d25ae67bd637e"
            }
        });
    }

    async sendVerificationEmail(email: string, token: string) {
        // Link to Angular frontend, which will then call the backend to verify
        const url = `http://localhost:4200/verify-email?token=${token}`;

        await this.transporter.sendMail({
            from: '"Employee Tracker" <no-reply@employeetracker.com>',
            to: email,
            subject: 'Verify your Email',
            html: `
        <h3>Welcome!</h3>
        <p>Please click the link below to verify your email address:</p>
        <p><a href="${url}">Verify Email</a></p>
        <p>Or copy this link: ${url}</p>
      `,
        });
    }
}
