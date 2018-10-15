import bodyParser from "koa-bodyparser";
import Router from "koa-router";

export default new Router({prefix: "/organisations"})
  .get("/:organisation", (ctx) => {
    ctx.body = {
      id: ctx.params.organisation,
    };
  })
  .post("/", bodyParser(), () => {
    // create organisation
  });
