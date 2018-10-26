import Koa from "koa";
import helmet from "koa-helmet";

import { jwtMiddleware } from "./auth/jwt";
import "./database/db"; // initialize objection
import router from "./router";

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
    ctx.response.set(
      "Access-Control-Request-Method",
      "GET, POST, PUT, OPTIONS"
    );
    ctx.response.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    return next();
  })
  .use(jwtMiddleware)
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(8080);
