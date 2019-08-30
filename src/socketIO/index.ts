import { Socket } from "socket.io";

import { verifyToken } from "../auth/jwt";

export type WSMiddleware = (socket: Socket & {[k: string]: any}, next: (err?: any) => void) => void;

export const wsAuth: WSMiddleware = async (socket, next) => {
  if (socket.handshake.headers.Authorization) {
    try {
      const {accountId} = await verifyToken(socket.handshake.headers.Authorization.replace("Bearer ", ""));

      socket.accountId = accountId; // link account to the socket

      next();
    } catch (e) {
      return next(Error(e));
    }
  }
  return next(Error("Authentication error."));
};
