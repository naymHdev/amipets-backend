import axios from 'axios';
import AppError from '../../errors/appError';
import { StatusCodes } from 'http-status-codes';
import path from 'path';
import { Response } from 'express';

const downloadThrowUrl = async (url: string, res: Response) => {
  if (!url) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Without URL, cannot download');
  }

  try {
    // Fetch the image from the URL
    const response = await axios.get(url, { responseType: 'stream' });

    // Set the file name based on URL or any custom logic
    const fileName = path.basename(url);

    // Set the response headers to prompt a download in the browser
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    res.setHeader('Content-Type', response.headers['content-type']);

    // Pipe the image from the external source to the client
    response.data.pipe(res);
  } catch (error) {
    console.error('Error downloading file:', error);
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Error downloading file',
    );
  }
};

export const DownloadService = {
  downloadThrowUrl,
};
