import { IParamMiddleware } from "koa-router";
import { NotFoundError } from "objection";
import { merge } from "ramda";

import Appliance from "../appliance/Appliance";
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
    throw new NotFoundError("Maintenance task not found for given hash");
  }

  const maintenanceEvent = await MaintenanceEvent
    .query()
    .select("assignedTo", "resolvedAt")
    .where("id", "=", maintenanceTask.maintenanceEvent)
    .first();
  if (typeof maintenanceEvent === "undefined") {
    throw new NotFoundError("Maintenance event not found for given hash");
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

export const applianceFromHash: IParamMiddleware = async (
  applianceHash,
  ctx,
  next
) => {
  ctx.state.appliance = await Appliance
    .query()
    .select("id")
    .where("hash", "=", applianceHash)
    .first();

  if (typeof ctx.state.appliance === "undefined") {
    throw new NotFoundError("appliance not found with given hash");
  } else {
    return next();
  }
};
