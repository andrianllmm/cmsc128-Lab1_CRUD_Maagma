import nodemailer from "nodemailer";
import { env } from "../config/env.js";

/**
 * SMTP connection, or `null` when SMTP isn't configured.
 * */
const transporter =
  env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS
    ? nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: env.SMTP_PORT,
        // Port 465 uses TLS from the start; others (e.g. 587) upgrade with STARTTLS
        secure: env.SMTP_PORT === 465,
        auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
      })
    : null;

/**
 * Sends an email.
 * Prints it to the terminal instead when SMTP isn't configured (local development only).
 * */
export const sendMail = async (
  to: string,
  subject: string,
  text: string,
): Promise<void> => {
  if (!transporter) {
    console.log(`To: ${to}\nSubject: ${subject}\n\n${text}`);
    return;
  }

  await transporter.sendMail({
    from: env.MAIL_FROM ?? env.SMTP_USER,
    to,
    subject,
    text,
  });
};
