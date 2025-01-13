import nodemailer from 'nodemailer';
import { getEnvVar } from './getEnvVar.js';
import { create } from 'express-handlebars';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const handlebars = create();

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: getEnvVar('SMTP_USER'),
    pass: getEnvVar('SMTP_PASSWORD'),
  },
  tls: {
    rejectUnauthorized: false,
  },
});

async function compileTemplate(templateName, data) {
  const templatePath = path.join(
    __dirname,
    '..',
    'templates',
    'emails',
    `${templateName}.hbs`,
  );
  const templateContent = await fs.readFile(templatePath, 'utf-8');
  const template = handlebars.handlebars.compile(templateContent);
  return template(data);
}

export const sendResetPasswordEmail = async (email, token) => {
  const resetLink = `${getEnvVar(
    'FRONTEND_URL',
  )}/reset-password?token=${token}`;
  const html = await compileTemplate('reset-password', { resetLink });

  const mailOptions = {
    from: {
      name: 'Password Reset Service',
      address: getEnvVar('SMTP_FROM'),
    },
    to: email,
    subject: 'Reset Your Password',
    html,
    headers: {
      'X-Priority': '1',
      'X-MSMail-Priority': 'High',
      Importance: 'high',
    },
  };

  const result = await transporter.sendMail(mailOptions);
  return result;
};
