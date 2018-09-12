import Koa from "koa";

const app = new Koa();

app
  .use((ctx) => {
    ctx.body = "CS-E4110";
  })
  .listen(8080);
