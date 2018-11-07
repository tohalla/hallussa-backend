import bodyParser from "koa-bodyparser";
import Router from "koa-router";

import Appliance from "./Appliance";

export default new Router({ prefix: "/appliances" })
  .get("/", async (ctx) => {
    // organisation param already set in parent router
    const { organisation } = ctx.params;
    ctx.body = await Appliance
      .query()
      .select()
      .where("organisation", "=", organisation);
  })
  .post("/", bodyParser(), async (ctx) => {
    // organisation param already set in parent router
    const { organisation } = ctx.params;
    ctx.body = await Appliance.query().insert({
      ...ctx.request.body,
      ...{ organisation: Number(organisation) },
    }).returning("*");
    ctx.status = 201;
  })
  .get("/:appliance", async (ctx) => {
    // organisation param already set in parent router
    const { organisation, appliance } = ctx.params;
    ctx.body = await Appliance
      .query()
      .select()
      .where("organisation", "=", organisation)
      .andWhere("id", "=", appliance)
      .first();
  })
  .patch("/:appliance", async (ctx) => {
    const { appliance } = ctx.params;
    ctx.body = await Appliance
      .query()
      .patch(ctx.request.body || {})
      .where("id", "=", appliance)
      .returning("*");
  });
  // TODO: Route to delete appliance, should require admin rights?
