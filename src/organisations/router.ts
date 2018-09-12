import koaBody from "koa-body";
import Router from "koa-router";

export default new Router({prefix: "/organisations"})
  .get("/:organisation", (ctx) => {
    ctx.body = {
      id: ctx.params.organisation,
    };
  })
  .post("/", koaBody(), () => {
    // create organisation
  });
