import http from "http";
import { path } from "ramda";
import io, { ServerOptions, Socket } from "socket.io";

import { Model } from "objection";
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

      return next();
    } catch (e) {
      return next(Error(e));
    }
  }
  return next(Error("Authentication error."));
};

let socketIO: undefined | io.Server;

export const initializeSocketIO = (server: http.Server) => {
  socketIO = io(server, {
    handlePreflightRequest,
    path: process.env.WS_PREFIX,
  } as ServerOptions);
  socketIO
    .use(wsAuth)
    .on("connection", (socket: Socket & {[k: string]: any}) => {
      socket.on("organisation", async (organisation) => {
        // Check that account is a member of the requested organisation
        if (path(
          ["rows", 0, "exists"],
          await Model.raw(
            `SELECT EXISTS(
              SELECT 1 FROM organisation_account where account = ?::integer AND organisation = ?::integer
            )`,
            socket.accountId,
            organisation
          )
        )) {
          socket.join(`/org/${organisation}`);
        }
      });
    });
};

export const emitTo = (
  organisation: number,
  event: string,
  ...args: any
) => {
  if (socketIO) {
    return socketIO
      .to(`/org/${organisation}`)
      .emit(event, ...args);
  }
  return false;
};

export const hasClients = (organisation: number) =>
  socketIO && socketIO.in(`/org/${organisation}`).clients.length > 0;

export const sendTo = (organisation: number, ...args: any) => emitTo(organisation, "message", ...args);

export default socketIO;
