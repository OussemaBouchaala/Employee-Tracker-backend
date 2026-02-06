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
                user: "05695a5af54c6f",
                pass: "baeb9136b13e21"
            }
        });
    }

    async sendVerificationEmail(email: string, token: string) {
        // Redirect to frontend - update this URL to match your frontend
        const frontendUrl = `http://localhost:4200/verify-email?token=${token}`;
        const currentYear = new Date().getFullYear();

        await this.transporter.sendMail({
            from: '"Employee Tracker" <no-reply@employeetracker.com>',
            to: email,
            subject: 'Verify Your Email Address - Employee Tracker',
            html: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Verify Your Email</title>
                </head>
                <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa;">
                    <table role="presentation" style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td align="center" style="padding: 40px 0;">
                                <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);">
                                    <!-- Header -->
                                    <tr>
                                        <td style="padding: 40px 40px 30px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px 12px 0 0;">
                                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                                                Employee Tracker
                                            </h1>
                                            <p style="margin: 10px 0 0; color: rgba(255, 255, 255, 0.9); font-size: 14px;">
                                                Your Career Journey Starts Here
                                            </p>
                                        </td>
                                    </tr>
                                    
                                    <!-- Main Content -->
                                    <tr>
                                        <td style="padding: 40px;">
                                            <h2 style="margin: 0 0 20px; color: #1a1a2e; font-size: 24px; font-weight: 600;">
                                                Welcome aboard! 🎉
                                            </h2>
                                            <p style="margin: 0 0 25px; color: #4a5568; font-size: 16px; line-height: 1.6;">
                                                Thank you for signing up for Employee Tracker. To get started and access all features, please verify your email address by clicking the button below.
                                            </p>
                                            
                                            <!-- CTA Button -->
                                            <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                                <tr>
                                                    <td align="center" style="padding: 10px 0 30px;">
                                                        <a href="${frontendUrl}" 
                                                        style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 8px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4); transition: all 0.3s ease;">
                                                            Verify My Email
                                                        </a>
                                                    </td>
                                                </tr>
                                            </table>
                                            
                                            <p style="margin: 0 0 15px; color: #718096; font-size: 14px; line-height: 1.6;">
                                                If the button doesn't work, copy and paste the following link into your browser:
                                            </p>
                                            <p style="margin: 0 0 25px; padding: 15px; background-color: #f7fafc; border-radius: 6px; word-break: break-all;">
                                                <a href="${frontendUrl}" style="color: #667eea; text-decoration: none; font-size: 13px;">
                                                    ${frontendUrl}
                                                </a>
                                            </p>
                                            
                                            <div style="border-top: 1px solid #e2e8f0; padding-top: 25px; margin-top: 10px;">
                                                <p style="margin: 0; color: #a0aec0; font-size: 13px; line-height: 1.6;">
                                                    <strong style="color: #718096;">⏰ This link expires in 24 hours.</strong><br>
                                                    If you didn't create an account with Employee Tracker, you can safely ignore this email.
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                    
                                    <!-- Footer -->
                                    <tr>
                                        <td style="padding: 30px 40px; background-color: #f7fafc; border-radius: 0 0 12px 12px; text-align: center;">
                                            <p style="margin: 0 0 10px; color: #718096; font-size: 14px;">
                                                Need help? Contact us at 
                                                <a href="mailto:support@employeetracker.com" style="color: #667eea; text-decoration: none;">
                                                    support@employeetracker.com
                                                </a>
                                            </p>
                                            <p style="margin: 0; color: #a0aec0; font-size: 12px;">
                                                © ${currentYear} Employee Tracker. All rights reserved.
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
            `,
        });
    }
}
