import bodyParser from "koa-bodyparser";
import Router from "koa-router";
import { path } from "ramda";

import { secureRoute } from "../auth/jwt";
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
    try {
      ctx.body = await Appliance.query().insert({
        ...ctx.request.body,
        ...{ organisation: Number(organisation) },
      });
      ctx.status = 201;
    } catch (e) {
      ctx.status = 400;
    }
  });
