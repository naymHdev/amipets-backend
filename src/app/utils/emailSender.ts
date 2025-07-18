import axios from 'axios';
import { StatusCodes } from 'http-status-codes';
import AppError from '../errors/appError';

const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const emailData = {
      to,
      subject,
      html,
    };

    const res = await axios.post(
      'https://nodemailler-fawn.vercel.app',
      emailData,
    );
    const result = res?.data;
    if (!result.success) {
      throw new AppError(StatusCodes.BAD_REQUEST, result.message);
    }
    return result;
  } catch (error) {
    console.log(error);
    throw new AppError(StatusCodes.BAD_REQUEST, 'Error sending email');
  }
};

export default sendEmail;
