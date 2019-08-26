import { IParamMiddleware } from "koa-router";
import { merge } from "ramda";

import Appliance from "../appliance/Appliance";
import Organisation from "../organisation/Organisation";
import MaintenanceEvent from "./MaintenanceEvent";
import MaintenanceTask from "./MaintenanceTask";

export const secureEvent: IParamMiddleware = async (taskHash, ctx, next) => {
  const maintenanceTask = await MaintenanceTask
    .query()
    .select()
    .where("hash", "=", taskHash)
    .first();

  // if task with given hash doesn't exists...
  if (typeof maintenanceTask === "undefined") {
    throw { status: 400, message: "error.maintenance.task.notFound" };
  }

  const maintenanceEvent = await MaintenanceEvent
    .query()
    .select()
    .where("id", "=", maintenanceTask.maintenanceEvent)
    .first();
  if (typeof maintenanceEvent === "undefined") {
    throw { status: 400, message: "error.maintenance.event.notFound" };
  } else if (maintenanceEvent.resolvedAt) { // task has been resolved
    // TODO: task resolved page
    ctx.body = `Task has been resolved at ${maintenanceEvent.resolvedAt}`;
  } else if (
    !maintenanceEvent.assignedTo ||
    maintenanceEvent.assignedTo === maintenanceTask.maintainer
  ) {
    // allow to operate
    ctx.state = merge(ctx.state, { maintenanceTask, maintenanceEvent });
    return next();
  } else {
      // TODO: task already accepted by someone else page
    ctx.body = `Task has already been accepted by someone else`;
  }
};

export const applianceFromHash = (
  options: { fetchOrganisation: boolean }
): IParamMiddleware => async (
  applianceHash,
  ctx,
  next
) => {
  ctx.state.appliance = await Appliance
    .query()
    .select("id", "name", "organisation", "description", "hash")
    .where("hash", "=", applianceHash)
    .first();

  if (options.fetchOrganisation) {
    ctx.state.organisation = await Organisation
      .query()
      .select("name")
      .where("id", "=", ctx.state.appliance.organisation)
      .first();
  }

  if (typeof ctx.state.appliance === "undefined") {
    throw { status: 400, message: "error.appliance.notFound" };
  } else {
    return next();
  }
};
