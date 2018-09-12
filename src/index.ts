import Koa from "koa";
import helmet from "koa-helmet";

const app = new Koa();

app
  .use(helmet()) // security headers
  .use((ctx) => {
    ctx.body = "CS-E4110";
  })
  .listen(8080);
