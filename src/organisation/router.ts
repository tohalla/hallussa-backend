import bodyParser from "koa-bodyparser";
import Router from "koa-router";
import Organisation from "./Organisation";

export default new Router({ prefix: "/organisations" })
  .get("/", async (ctx) => {
    // TODO: Should organisations be public? if so, limit public data
    ctx.body = await Organisation.query().select();
  })
  .get("/:organisation", async (ctx) => {
    ctx.body = await Organisation.query()
      .select()
      .where("id", "=", ctx.params.organisation)
      .first();
  })
  .post("/", bodyParser(), () => {
    // create organisation
  });
