import { IParamMiddleware } from "koa-router";
import { NotFoundError } from "objection";
import Appliance from "../appliance/Appliance";
import MaintenanceEvent from "./MaintenanceEvent";
import MaintenanceTask from "./MaintenanceTask";

export const secureEvent: IParamMiddleware = async (taskHash, ctx, next) => {
  try {
    const task = await MaintenanceTask
      .query()
      .select()
      .where("hash", "=", taskHash)
      .first();

    // if task with given hash doesn't exists...
    if (typeof task === "undefined") {
      throw new NotFoundError("Maintenance task not found for given hash");
    }

    const event = await MaintenanceEvent
      .query()
      .select("isAvailable", "assignedTo")
      .where("id", "=", task.maintenanceEvent)
      .first();

    if (typeof event === "undefined") {
      // TODO: already assigned page
      ctx.body = "task is already assigned";
    } else {
      ctx.state.task = task;
      return next();
    }
  } catch (e) {
    if (e instanceof NotFoundError) {
      ctx.body = e;
      ctx.status = 404;
    } else {
      ctx.status = 400;
    }
  }
};

export const applianceFromHash: IParamMiddleware = async (
  applianceHash,
  ctx,
  next
) => {
  try {
    ctx.state.appliance = await Appliance
      .query()
      .select("id")
      .where("hash", "=", applianceHash)
      .first();

    if (typeof ctx.state.appliance === "undefined") {
      ctx.status = 404; // appliance with given hash does not exists "not found"
    } else {
      return next();
    }
  } catch (e) {
    // something went wrong when fetching appliance. e.g. appliance hash in wrong format
    ctx.status = 400;
  }
};
