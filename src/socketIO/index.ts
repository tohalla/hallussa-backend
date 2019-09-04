import http from "http";
import socketIO, { ServerOptions, Socket } from "socket.io";

import { verifyToken } from "../auth/jwt";

export type WSMiddleware = (socket: Socket & {[k: string]: any}, next: (err?: any) => void) => void;

const handlePreflightRequest = (req: any, res: any) => {
  res.writeHead(200, {
    "Access-Control-Allow-Credentials": true,
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Origin": req.headers.origin,
  });
  res.end();
};

const wsAuth: WSMiddleware = async (socket, next) => {
  const authorization = socket.handshake.headers.authorization || socket.handshake.headers.Authorization;
  if (authorization) {
    try {
      const {accountId} = await verifyToken(authorization.replace("Bearer ", ""));

      socket.accountId = accountId; // link account to the socket

      next();
    } catch (e) {
      return next(Error(e));
    }
  }
  return next(Error("Authentication error."));
};

export default (server: http.Server) => socketIO(server, {
  handlePreflightRequest,
  path: process.env.WS_PREFIX,
} as ServerOptions).use(wsAuth);
