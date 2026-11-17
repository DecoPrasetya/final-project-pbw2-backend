import nodemailer from 'nodemailer';
import { env } from '../config/env';

export const transporter = nodemailer.createTransport({
  host: env.MAIL_HOST,
  port: env.MAIL_PORT,
  secure: env.MAIL_PORT === 465,
  auth: env.MAIL_PASS ? { user: env.MAIL_USER, pass: env.MAIL_PASS } : undefined,
});

export async function sendMail(to: string, subject: string, html: string): Promise<void> {
  if (!env.MAIL_PASS) {
    console.log(`[mailer] (dev mode) skip sending to=${to} subject=${subject}`);
    return;
  }
  await transporter.sendMail({ from: env.MAIL_USER, to, subject, html });
}