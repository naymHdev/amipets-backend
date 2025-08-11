import { socket } from '../config/socket.config';

export const emitMessage = (id: string, key: string, data: object) => {
  socket().to(id).emit(key, data);
};

export const emitMessageToAdmin = (key: string, data: object) => {
  console.log('Emitting to Admin:', key, data); // Add this

  socket().to('Admin').emit(key, data);
};

export const emitMessageToUser = (key: string, data: object) => {
  console.log('Emitting to User:', key, data);
  socket().to('User').emit(key, data);
};

export const emitMessageToShelter = (key: string, data: object) => {
  console.log('Emitting to Shelter:', key, data);
  socket().to('Shelter').emit(key, data);
};
