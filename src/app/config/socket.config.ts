import { Server } from 'http';
import { Server as SocketIoServer, Socket } from 'socket.io';
import AppError from '../errors/appError';
import { StatusCodes } from 'http-status-codes';

let io: SocketIoServer | null = null;

export const socketIo = (server: Server) => {
  io = new SocketIoServer(server, {
    cors: {
      origin: ['*'],
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket: Socket) => {
    console.log('Admin connected via Socket.IO:', socket.id);

    socket.on('join', (id: string, admin?: boolean) => {
      socket.join(id);
      if (admin) {
        socket.join('Admin');
      }
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
};

export const socket = (): SocketIoServer => {
  if (!io) {
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Socket.IO server not initialized',
    );
  }
  return io;
};
