import nodemailer from 'nodemailer';
import config from '../config';
import AppError from '../errors/appError';
import { StatusCodes } from 'http-status-codes';

export const sendEmail = async (to: string, subject: string, html: string) => {
 try{
   const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    // port: process.env.EMAIL_ENV === 'production' ? 465 : 587,
    port: 465,
    secure: true,
    auth: {
      user: config.nodemailer_host_email,
      pass: config.nodemailer_host_pass,
    },
  });

  await transporter.sendMail({
    from: 'naymhossen09@gmail.com', // sender address
    to, // list of receivers
    subject,
    text: '', // plain text body
    html, // html body
  });
 }catch(err){
   console.log(err);
   throw new AppError(StatusCodes.BAD_REQUEST, 'Email send failed, try agian');
 }
};
