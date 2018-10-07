import Koa from "koa";
import helmet from "koa-helmet";

import { jwtMiddleware } from "./auth/jwt";
import router from "./router";

const app = new Koa();

app
  .use(helmet()) // security headers
  .use(jwtMiddleware)
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(8080);
