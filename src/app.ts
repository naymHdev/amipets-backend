/* eslint-disable no-unused-vars */
import cors from 'cors';
import express, { Application, NextFunction, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import os from 'os';
import { StatusCodes } from 'http-status-codes';
import globalErrorHandler from './app/middleware/globalErrorHandler';
import notFound from './app/middleware/notFound';
import router from './app/routes';
import { createServer } from 'http';
import { socketIo } from './app/config/socket.config';

const app: Application = express();

app.use(
  cors({
    origin: [
      'https://amipeta.lt',
      'https://www.amipeta.lt',
      'http://localhost:3000',
      'https://api.amipeta.lt',
      'https://www.api.amipeta.lt',
      'https://dashboard.amipeta.lt',
      'https://www.dashboard.amipeta.lt',
    ],
    credentials: true,
  }),
);

// app.use(
//   cors({
//     origin: true,
//     credentials: true,
//   }),
// );

// HTTP socket Server setup
export const httpServer = createServer(app);
socketIo(httpServer);



app.use(cookieParser());
app.use(express.json({limit : "1000mb"}))
app.use(express.urlencoded({ extended: true, limit : "1000mb", parameterLimit: 1000000 }));
app.use(express.static('public'));

app.use('/api/v1', router);

// Test route
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.get('/', (req: Request, res: Response, next: NextFunction) => {
  const currentDateTime = new Date().toISOString();
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const serverHostname = os.hostname();
  const serverPlatform = os.platform();
  const serverUptime = os.uptime();

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Welcome to the Ami Pets API',
    version: '1.0.0',
    clientDetails: {
      ipAddress: clientIp,
      accessedAt: currentDateTime,
    },
    serverDetails: {
      hostname: serverHostname,
      platform: serverPlatform,
      uptime: `${Math.floor(serverUptime / 60 / 60)} hours ${Math.floor(
        (serverUptime / 60) % 60,
      )} minutes`,
    },
    developerContact: {
      email: 'naymhossen09@gmail.com',
      website: 'https://naymweb.vercel.app',
    },
  });
});

app.use(globalErrorHandler);

//Not Found
app.use(notFound);

export default app;
