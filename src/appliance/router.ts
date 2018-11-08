import bodyParser from "koa-bodyparser";
import Router from "koa-router";
import QRCode from "qrcode";
import { path, reduce } from "ramda";

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
  .get("/qr", bodyParser(), async (ctx) => {
    // organisation param already set in parent router
    const { organisation } = ctx.params;

    const applianceIDs = JSON.parse(ctx.request.query.appliances);
    // should throw error if appliance ID's not passed
    if (!Array.isArray(applianceIDs) || applianceIDs.length === 0) {
      return ctx.throw(400, "Define requested appliance");
    }

    // fetch specified appliances (only if listed under organisation)
    const appliances = await Appliance
      .query()
      .select("hash")
      .whereIn("id", applianceIDs)
      .andWhere("organisation", "=", organisation);

    if (appliances.length === 0) {
      return ctx.throw(404);
    }
    const qrCodes = await Promise.all(
      appliances.map(async (appliance) =>
        QRCode.toString(
          `http://${ctx.request.host}/api/v1/maintenance/${appliance.hash}`,
          {errorCorrectionLevel: "medium", type: "svg", scale: 2}
        ),
        appliances
      )
    );

    const qrElements = reduce(
      (prev, curr) => prev + `<div style=\"width: 250px; height: auto;\">${
        curr
      }</div>`,
      "",
      qrCodes
    );

    ctx.body = `<!doctype html><html><head></head><body>${
      qrElements
    }</body></html>`;
    ctx.type = "application/html";
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
