import Koa from "koa";
import helmet from "koa-helmet";

import router from "./router";

const app = new Koa();

app
  .use(helmet()) // security headers
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(8080);
