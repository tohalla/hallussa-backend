import bodyParser from "koa-bodyparser";
import Router from "koa-router";

import Maintainer from "./Maintainer";

export default new Router({ prefix: "/maintainers" })
  .get("/", async (ctx) => {
    // organisation param already set in parent router
    const { organisation } = ctx.params;
    ctx.body = await Maintainer
      .query()
      .select()
      .where("organisation", "=", organisation);
  })
  .post("/", bodyParser(), async (ctx) => {
    // organisation param already set in parent router
    const { organisation } = ctx.params;
    try {
      ctx.body = await Maintainer.query().insert({
        ...ctx.request.body,
        ...{ organisation: Number(organisation) },
      }).returning("*");
      ctx.status = 201;
    } catch (e) {
      ctx.status = 400;
    }
  })
  .patch("/:maintainer", async (ctx) => {
    const { maintainer } = ctx.params;
    ctx.body = await Maintainer
      .query()
      .patch(ctx.request.body || {})
      .where("id", "=", maintainer)
      .returning("*");
  });
  // TODO: Route to delete maintainer, should require admin rights?
