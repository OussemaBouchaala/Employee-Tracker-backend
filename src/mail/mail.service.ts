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
                user: "571a4018b71ea6",
                pass: "f9023b0747e5ab"
            }
        });
    }

    async sendVerificationEmail(email: string, token: string) {
        const url = `http://localhost:3000/auth/verify?token=${token}`;

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
