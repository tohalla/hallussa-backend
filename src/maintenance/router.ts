import i18n from "i18next";
import bodyParser from "koa-bodyparser";
import Router from "koa-router";
import { path } from "ramda";

import Appliance from "../appliance/Appliance";
import MaintenanceEvent from "./MaintenanceEvent";
import MaintenanceTask from "./MaintenanceTask";
import { applianceFromHash, secureEvent } from "./middleware";

// Templates
import ExistingDescription from "../templates/maintenance/request/ExistingDescription";
import ExistingRequestForm from "../templates/maintenance/request/ExistingRequestForm";
import NewDescription from "../templates/maintenance/request/NewDescription";
import NewRequestForm from "../templates/maintenance/request/NewRequestForm";
import Request from "../templates/maintenance/request/Request";

import { apiURL } from "../config";
import AcceptForm from "../templates/maintenance/resolve/AcceptForm";
import Done from "../templates/maintenance/resolve/Done";
import MaintenanceForm from "../templates/maintenance/resolve/MaintenanceForm";
import Resolve from "../templates/maintenance/resolve/Resolve";

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
    const data = {
      appliance: ctx.state.appliance,
      event: maintenanceEvent,
      organisation: ctx.state.organisation.name,
      task: maintenanceTask,
    };

    if (maintenanceEvent.assignedTo === maintenanceTask.maintainer) {
      ctx.body = Resolve(
        data,
        MaintenanceForm
      );
    } else if (!maintenanceEvent.assignedTo) {
      ctx.body = Resolve(
        data,
        AcceptForm
      );
    }
  })
  .post("/", bodyParser(), async (ctx) => {
    const {maintenanceEvent, maintenanceTask} = ctx.state as MaintenanceState;

    if (!maintenanceEvent.assignedTo) {
      ctx.throw(i18n.t("error.maintenance.event.notAssigned", {lng: ctx.headers["Accept-Language"]}), 403);
    }
    const description = path(["request", "body", "description"], ctx) as string | undefined;
    await Promise.all([
      MaintenanceTask.query().patch({description}).where("hash", maintenanceTask.hash),
      MaintenanceEvent
        .query()
        .patch({ resolvedAt: new Date().toISOString() })
        .where("id", maintenanceTask.maintenanceEvent),
    ]);
    // TODO infopage
    ctx.body = Resolve(
      {
        appliance: ctx.state.appliance,
        event: maintenanceEvent,
        organisation: ctx.state.organisation.name,
        task: maintenanceTask,
      },
      Done
    );
  })
  .post("/accept", async (ctx) => {
    const {maintenanceEvent, maintenanceTask} = ctx.state as MaintenanceState;
    if (maintenanceEvent.assignedTo) {
      ctx.throw(i18n.t("error.maintenance.event.alreadyAssigned", {lng: ctx.headers["Accept-Language"]}), 400);
    }
    maintenanceEvent.assign(maintenanceTask.hash);
    ctx.status = 200;
    ctx.redirect(
      `${apiURL}/maintenance/${ctx.params.applianceHash}/${ctx.params.taskHash}`
    );
  })
  .del("/", bodyParser(), async (ctx) => {
    // TODO: handle maintainer cancellation
  });

export default new Router({ prefix: "/maintenance/:applianceHash" })
  .param("applianceHash", applianceFromHash({ fetchOrganisation: true }))
  .get("/", async (ctx) => {
    const event = await MaintenanceEvent
      .query()
      .select()
      .where("appliance", ctx.state.appliance.id)
      .whereNull("resolved_at")
      .first();

    const [description, form] = event ? [ExistingDescription, ExistingRequestForm] : [NewDescription, NewRequestForm];

    ctx.body = Request(
      ctx.params.applianceHash,
      ctx.state.appliance.name,
      ctx.state.organisation.name,
      description,
      form
    );
  })
  .post("/", bodyParser(), async (ctx) => {
    // appliance is set at applianceFromHash middleware
    const appliance = ctx.state.appliance as Appliance;
    const description = path(["request", "body", "description"], ctx) as string | undefined;
    const subscribe = path(["request", "body", "subscribe"], ctx) as string | undefined;

    await MaintenanceEvent.query().insert({
      appliance: appliance.id,
      description,
      organisation: appliance.organisation,
    });

    if (subscribe) {
      // TODO: Subscription
    }

    ctx.status = 201;
    // TODO: Serve response page here
    // ctx.redirect(
    //   `${apiUrl}/response.html?org=${ctx.state.organisation.name}&app=${ctx.state.appliance.name}`
    // );
  })
  .use(taskRouter.routes(), taskRouter.allowedMethods());
