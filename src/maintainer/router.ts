import bodyParser from "koa-bodyparser";
import Router from "koa-router";
import { map } from "ramda";

import Appliance from "../appliance/Appliance";
import { RouterStateContext } from "../organisation/router";
import Maintainer, { normalizeMaintainer } from "./Maintainer";

export default new Router<RouterStateContext>({ prefix: "/maintainers" })
  .get("/", async (ctx) => {
    // organisation param already set in parent router
    const { organisation } = ctx.params;
    ctx.body = map(normalizeMaintainer, await Maintainer
      .query()
      .select()
      .where("organisation", "=", organisation)
      .eager(ctx.query.eager)
      .modifyEager("appliances", (builder) => builder.select("appliance"))
    );
  })
  .post("/", bodyParser(), async (ctx) => {
    if (!ctx.state.rights.allowCreateMaintainer) {
      return ctx.throw(401);
    }
    // organisation param already set in parent router
    const { organisation } = ctx.params;
    ctx.body = await Maintainer.query().insert({
      ...ctx.request.body,
      ...{ organisation: Number(organisation) },
    }).returning("*");
    ctx.status = 201;
  })
  .patch("/:maintainer", bodyParser(), async (ctx) => {
    if (!ctx.state.rights.allowUpdateMaintainer) {
      return ctx.throw(401);
    }
    const { maintainer } = ctx.params;
    ctx.body = await Maintainer
      .query()
      .patch(ctx.request.body || {})
      .where("id", "=", maintainer)
      .returning("*")
      .first();
  })
  .get("/:maintainer", async (ctx) => {
    const { maintainer } = ctx.params;
    ctx.body = normalizeMaintainer((await Maintainer
      .query()
      .select()
      .where("id", "=", maintainer)
      .eager(ctx.query.eager)
      .modifyEager("appliances", (builder) => builder.select("appliance"))
      .first()
    ));
  })
  .del("/:maintainer", async (ctx) => {
    if (!ctx.state.rights.allowDeleteMaintainer) {
      return ctx.throw(401);
    }
    const { maintainer } = ctx.params;
    await Maintainer.query().deleteById(maintainer);
    ctx.status = 200;
  })
  .get("/:maintainer/appliances", async (ctx) => {
    const { maintainer } = ctx.params;
    ctx.body = await Appliance
      .query()
      .select()
      .joinRaw(
        "JOIN appliance_maintainer ON appliance_maintainer.maintainer=?::integer " +
        "AND appliance_maintainer.appliance=appliance.id",
        maintainer
      );
  });
