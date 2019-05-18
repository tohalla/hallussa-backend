import bodyParser from "koa-bodyparser";
import Router from "koa-router";
import { Model } from "objection";
import { map } from "ramda";

import Maintainer from "../maintainer/Maintainer";
import MaintenanceEvent from "../maintenance/MaintenanceEvent";
import { RouterStateContext } from "../organisation/router";
import { getQRPage } from "../util/qr";
import Appliance, { normalizeAppliance } from "./Appliance";

// separate router for single appliance
const applianceRouter = new Router<RouterStateContext>({ prefix: "/:appliance"})
  .get("/", async (ctx) => {
    // organisation param already set in parent router
    const { organisation, appliance } = ctx.params;
    ctx.body = normalizeAppliance(await Appliance
      .query()
      .select()
      .where("organisation", "=", organisation)
      .andWhere("id", "=", appliance)
      .first()
      .eager(ctx.query.eager)
      .modifyEager("maintainers", (builder) => builder.select("maintainer"))
    );
  })
  .patch("/", bodyParser(), async (ctx) => {
    const { appliance } = ctx.params;
    if (!ctx.state.rights.allowUpdateAppliance) {
      return ctx.throw(403);
    }
    ctx.body = await Appliance
      .query()
      .patch(ctx.request.body || {})
      .where("id", "=", appliance)
      .returning("*")
      .first();
  })
  .del("/", async (ctx) => {
    if (!ctx.state.rights.allowDeleteAppliance) {
      return ctx.throw(403);
    }
    const { appliance } = ctx.params;
    await Appliance.query().deleteById(appliance);
    ctx.status = 200;
  })
  .get("/maintainers", async (ctx) => {
    const { appliance } = ctx.params;
    ctx.body = await Maintainer
      .query()
      .select()
      .joinRaw(
        "JOIN appliance_maintainer ON appliance_maintainer.appliance=?::integer " +
        "AND appliance_maintainer.maintainer=maintainer.id",
        appliance
      );
  })
  .post("/maintainers/:maintainer", async (ctx) => {
    if (!ctx.state.rights.allowUpdateAppliance) {
      return ctx.throw(403);
    }
    const { appliance, maintainer } = ctx.params;

    await Model.raw(
      "INSERT INTO appliance_maintainer (appliance, maintainer) VALUES (?::integer, ?::integer)",
      appliance,
      maintainer
    );

    ctx.status = 201;
  })
  .del("/maintainers/:maintainer", async (ctx) => {
    if (!ctx.state.rights.allowUpdateAppliance) {
      return ctx.throw(403);
    }
    const { appliance, maintainer } = ctx.params;

    await Model.raw(
      "DELETE FROM appliance_maintainer WHERE appliance=?::integer AND maintainer=?::integer",
      appliance,
      maintainer
    );

    ctx.status = 200;
  })
  .get("/maintenance-events", async (ctx) => {
    const { appliance } = ctx.params;
    ctx.body = await MaintenanceEvent
      .query()
      .select()
      .where("maintenance_event.appliance", appliance);
  });

export default new Router({ prefix: "/appliances" })
  .get("/", async (ctx) => {
    // organisation param already set in parent router
    const { organisation } = ctx.params;
    ctx.body = map(normalizeAppliance, await Appliance
      .query()
      .select()
      .where("organisation", "=", organisation)
      .eager(ctx.query.eager)
      .modifyEager("maintainers", (builder) => builder.select("maintainer"))
    );
  })
  .post("/", bodyParser(), async (ctx) => {
    if (!ctx.state.rights.allowCreateAppliance) {
      return ctx.throw(403);
    }
    // organisation param already set in parent router
    const { organisation } = ctx.params;
    ctx.body = await Appliance.query().insert({
      ...ctx.request.body,
      organisation: Number(organisation),
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
      await getQRPage(applianceIDs, organisation)
    }</body></html>`;
    ctx.type = "application/html";
  })
  .use(applianceRouter.routes(), applianceRouter.allowedMethods());
