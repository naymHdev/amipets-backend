import nodemailer from 'nodemailer';
import config from '../config';
import { StatusCodes } from 'http-status-codes';
import AppError from '../errors/appError';

type TAttachment = {
  filename: string;
  path: string;
  cid?: string;
  contentType?: string;
  content?: string;
};

type TEmail = {
  to: string;
  html: string;
  subject: string;
  from?: string;
  attachments?: TAttachment[];
};

const sendMail = async ({ to, html, subject, from, attachments }: TEmail) => {
  try {
    if (!to) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        'Recipient email (to) is required',
      );
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: config.NODE_ENV === 'production' ? 465 : 587,
      secure: false,
      auth: {
        user: config.nodemailer_host_email,
        pass: config.nodemailer_host_pass,
      },
      attachments,
    });

    // send mail with defined transport object
    const res = await transporter.sendMail({
      from: from || config.nodemailer_host_email,
      to,
      replyTo: from || config.nodemailer_host_email,
      subject,
      html,
    });

    console.log(res.messageId, '------email sent successfully------');
  } catch (error) {
    console.log('send mail error_____', error);
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      (error as Error).message || 'Failed to send email',
    );
  }
};

export default sendMail;
