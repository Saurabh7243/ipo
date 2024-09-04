import { Server as HttpServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

let io: SocketIOServer;

export const initSocket = (server: HttpServer) => {
  io = new SocketIOServer(server);
  return io;
};

export const getIo = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};