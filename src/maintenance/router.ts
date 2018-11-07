import bodyParser from "koa-bodyparser";
import Router from "koa-router";

import Appliance from "../appliance/Appliance";
import MaintenanceEvent from "./MaintenanceEvent";
import { applianceFromHash, secureEvent } from "./middleware";

const taskRouter = new Router({ prefix: "/:taskHash" })
  .param("taskHash", secureEvent)
  .get("/", (ctx) => {
    // values set in secureEvent middleware
    const {maintenanceEvent, maintenanceTask} = ctx.state;
    if (maintenanceEvent.assignedTo === maintenanceTask.maintainer) {
      // TODO: return maintainer form
      ctx.body = "maintainer form";
    } else if (!maintenanceEvent.assignedTo) {
      // TODO: return accept maintenance page
      ctx.body = "accept maintenance page";
    }
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
