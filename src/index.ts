import http from "http";
import Koa from "koa";
import helmet from "koa-helmet";

import { jwtMiddleware } from "./auth/jwt";
import "./database/db"; // initialize objection
import { initializeSG } from "./email";
import { initializeI18n } from "./i18n";
import router from "./router";
import socketIO from "./socketIO";
import { errorHandling } from "./util/error";

const {API_PORT} = process.env;

initializeI18n();
initializeSG();

const app = new Koa()
  .use(helmet()) // security headers
  .use((ctx, next) => {
    ctx.response.set(
      "Access-Control-Allow-Origin",
      process.env.WEBAPP_URL || ""
    );
    ctx.response.set("Access-Control-Allow-Credentials", "true");
    ctx.response.set("Access-Control-Request-Method", "GET, PATCH, POST, PUT, DELETE, OPTIONS");
    ctx.response.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    ctx.response.set("Access-Control-Allow-Methods", "GET, PATCH, POST, PUT, DELETE, OPTIONS");
    return next();
  })
  .use(errorHandling)
  .use(jwtMiddleware)
  .use(router.routes())
  .use(router.allowedMethods());

const server = http.createServer(app.callback());

socketIO(server);

server.listen(API_PORT);
