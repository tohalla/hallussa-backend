import bodyParser from "koa-bodyparser";
import Router from "koa-router";

import Appliance from "../appliance/Appliance";
import MaintenanceEvent from "./MaintenanceEvent";
import { applianceFromHash, secureEvent } from "./middleware";

const taskRouter = new Router({ prefix: "/:taskHash" })
  .param("taskHash", secureEvent)
  .get("/", (ctx) => {
    // TODO: return maintainer form
  })
  .post("/", bodyParser(), async (ctx) => {
    // TODO: handle maintainer form
  })
  .del("/", bodyParser(), async (ctx) => {
    // TODO: handle maintainer cancellation
  });

export default new Router({ prefix: "/maintenance/:applianceHash" })
  .param("applianceHash", applianceFromHash)
  .get("/", (ctx) => {
    // TODO: return maintenance report form page
  })
  .post("/", bodyParser(), async (ctx) => {
    const appliance = ctx.state.appliance as Appliance;
    await MaintenanceEvent.query().insert({
      appliance: appliance.id,
      description: "test",
    });
    ctx.status = 201;
  })
  .use(taskRouter.routes(), taskRouter.allowedMethods());
