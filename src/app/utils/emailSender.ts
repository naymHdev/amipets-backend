import axios from 'axios';
import config from '../config';
import AppError from '../errors/appError';
import { StatusCodes } from 'http-status-codes';

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const emailData = {
      to,
      from: config.nodemailer_host_email,
      subject,
      html,
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      userEmail: config.nodemailer_host_email,
      appPassword: config.nodemailer_host_pass,
    };

    const res = await axios.post(
      'https://nodemailer-transaction.vercel.app',
      emailData,
    );
    const result = res?.data;
    if (!result.success) {
      throw new AppError(StatusCodes.BAD_REQUEST, result.message);
    }
    console.log('Email sent successfully');
    return result;
  } catch (error) {
    console.log('Error sending email________', error);
    throw new AppError(StatusCodes.BAD_REQUEST, 'Error sending email');
  }
};
