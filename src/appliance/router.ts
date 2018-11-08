import bodyParser from "koa-bodyparser";
import Router from "koa-router";

import { getQRPage } from "../util/qr";
import Appliance from "./Appliance";

// separate router for single appliance
const applianceRouter = new Router({ prefix: "/:appliance"})
  .get("/", async (ctx) => {
    // organisation param already set in parent router
    const { organisation, appliance } = ctx.params;
    ctx.body = await Appliance
      .query()
      .select()
      .where("organisation", "=", organisation)
      .andWhere("id", "=", appliance)
      .first();
  })
  .patch("/", async (ctx) => {
    const { appliance } = ctx.params;
    ctx.body = await Appliance
      .query()
      .patch(ctx.request.body || {})
      .where("id", "=", appliance)
      .returning("*");
  })
  .del("/", async (ctx) => {
    const { appliance } = ctx.params;
    ctx.body = await Appliance
      .query()
      .deleteById(appliance);
  });

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
  .get("/qr", bodyParser(), async (ctx) => {
    // organisation param already set in parent router
    const { organisation } = ctx.params;

    const applianceIDs = JSON.parse(ctx.request.query.appliances);
    // should throw error if appliance ID's not passed
    if (!Array.isArray(applianceIDs) || applianceIDs.length === 0) {
      return ctx.throw(400, "Define requested appliance");
    }

    ctx.body = `<!doctype html><html><head></head><body>${
      await getQRPage(applianceIDs, organisation, ctx.request.host)
    }</body></html>`;
    ctx.type = "application/html";
  })
  .use(applianceRouter.routes(), applianceRouter.allowedMethods());
