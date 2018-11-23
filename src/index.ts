import Koa from "koa";
import helmet from "koa-helmet";

import { jwtMiddleware } from "./auth/jwt";
import "./database/db"; // initialize objection
import router from "./router";
import { errorHandling } from "./util/error";

const app = new Koa();

if (process.env.NODE_ENV === "development") {
  app.use((ctx, next) => {
    ctx.response.set("Access-Control-Allow-Origin", "*");
    return next();
  });
}

app
  .use(helmet()) // security headers
  .use((ctx, next) => {
    ctx.response.set("Access-Control-Allow-Credentials", "true");
    ctx.response.set("Access-Control-Request-Method", "GET, PATCH, POST, DELETE, OPTIONS");
    ctx.response.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    ctx.response.set("Access-Control-Allow-Methods", "GET, PATCH, POST, DELETE, OPTIONS");
    return next();
  })
  .use(errorHandling)
  .use(jwtMiddleware)
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(8080);
