import { Model } from "objection";
import { dissoc, evolve, map, prop } from "ramda";

import MaintenanceEvent from "../maintenance/MaintenanceEvent";
import ApplianceMaintainer from "../relation-models/ApplianceMaintainer";
import ApplianceStatus from "./ApplianceStatus";

export default class Appliance extends Model {
  public static tableName = "appliance";

  public static relationMappings = {
    maintainers: { // should never eagerly load maintainers, only ID's
      join: {
        from: "appliance.id",
        to: "appliance_maintainer.appliance",
      },
      modelClass: ApplianceMaintainer,
      relation: Model.HasManyRelation,
    },
    maintenanceEvents: {
      join: {
        from: "appliance.id",
        to: "maintenance_event.appliance",
      },
      modelClass: MaintenanceEvent,
      relation: Model.HasManyRelation,
    },
    status: {
      join: {
        from: "appliance.id",
        to: "appliance_status.appliance",
      },
      modelClass: ApplianceStatus,
      relation: Model.HasOneRelation,
    },
  };

  public static jsonSchema = {
    type: "object",

    properties: {
      id: { type: "integer" },

      name: { type: "string", minLength: 1, maxLength: 64 },
    },
    required: ["name"],
  };

  public id?: number;
  public name?: string;
  public updatedAt?: string;
  public description?: string;
  public hash?: string;
  public createdAt?: string;
  public organisation?: number;
  public maintainers: ReadonlyArray<number> = [];

  public async $beforeUpdate() {
    delete this.id; // should not update id field
    delete this.createdAt; // should not update createdAt field
    delete this.organisation; // should not update organisation field

    this.updatedAt = new Date().toISOString();
  }
}

// normalizes maintainer
export const normalizeAppliance = (appliance: Appliance | undefined) =>
 appliance && evolve({
   maintainers: map(prop("maintainer")),
   status: dissoc("appliance"),
 }, appliance as object);
