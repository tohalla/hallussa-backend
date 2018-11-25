import Router from "koa-router";

export default new Router({prefix: "/test"})
  .get("/", (ctx) => {
    ctx.response.set("Content-Type", "text/html");
    ctx.body = "This router is intended for testing SSR-views.";
  });
