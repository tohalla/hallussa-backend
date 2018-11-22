import bodyParser from "koa-bodyparser";
import Router from "koa-router";
import { path } from "ramda";

import Appliance from "../appliance/Appliance";
import MaintenanceEvent from "./MaintenanceEvent";
import MaintenanceTask from "./MaintenanceTask";
import { applianceFromHash, secureEvent } from "./middleware";

// Templates
import ExistingRequest from "../templates/maintenance/request/ExistingRequest";
import Request from "../templates/maintenance/request/Request";

interface MaintenanceState {
  appliance: Appliance;
  maintenanceEvent: MaintenanceEvent;
  maintenanceTask: MaintenanceTask;
}

const taskRouter = new Router({ prefix: "/:taskHash" })
  .param("taskHash", secureEvent)
  .get("/", (ctx) => {
    // values set in secureEvent middleware
    const {maintenanceEvent, maintenanceTask} = ctx.state as MaintenanceState;
    if (maintenanceEvent.assignedTo === maintenanceTask.maintainer) {
      // TODO: return maintainer form
      ctx.body = "maintainer form";
    } else if (!maintenanceEvent.assignedTo) {
      // TODO: return accept maintenance page
      ctx.body = "accept maintenance page";
    }
  })
  .post("/", bodyParser(), async (ctx) => {
    const {maintenanceEvent, maintenanceTask} = ctx.state as MaintenanceState;
    if (!maintenanceEvent.assignedTo) {
      return ctx.throw(401, "Maintenance event has not been assigned to anyone.");
    }
    // TODO: handle maintainer form
  })
  .post("/accept", async (ctx) => {
    const {maintenanceEvent, maintenanceTask} = ctx.state as MaintenanceState;
    if (maintenanceEvent.assignedTo) {
      return ctx.throw(400, "Maintenance event has already been assigned.");
    }
    maintenanceEvent.assign(maintenanceTask.hash);
    // TODO: maintenance task has been accepted page
    ctx.status = 200;
  })
  .del("/", bodyParser(), async (ctx) => {
    // TODO: handle maintainer cancellation
  });

export default new Router({ prefix: "/maintenance/:applianceHash" })
  .param("applianceHash", applianceFromHash({ fetchOrganisation: true }))
  .get("/", async (ctx) => {
    // If resolvedAt is null or undefined
    const event = await MaintenanceEvent
      .query()
      .select()
      .where("appliance", ctx.state.appliance.id)
      .whereNull("resolvedAt")
      .first();

    ctx.body = event ?
      ExistingRequest(ctx.params.applianceHash)
    : Request(
      ctx.params.applianceHash,
      ctx.state.appliance.name,
      ctx.state.organisation.name
    );
  })
  .post("/", bodyParser(), async (ctx) => {
    // appliance is set at applianceFromHash middleware
    const appliance = ctx.state.appliance as Appliance;
    const description = path(["request", "body", "description"], ctx) as string;
    await MaintenanceEvent.query().insert({
      appliance: appliance.id,
      description,
    });
    ctx.status = 201;
  })
  .use(taskRouter.routes(), taskRouter.allowedMethods());
