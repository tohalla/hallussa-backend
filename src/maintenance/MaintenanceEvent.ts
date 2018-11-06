import { Model } from "objection";
import Appliance from "../appliance/Appliance";
import MaintenanceTask from "./MaintenanceTask";

export default class MaintenanceEvent extends Model {
  public static tableName = "maintenance_event";

  public static relationMappings = {
    appliance: {
      join: {
        from: "maintenance_event.appliance",
        to: "appliance.id",
      },
      modelClass: Appliance,
      relation: Model.BelongsToOneRelation,
    },
    tasks: {
      join: {
        from: "maintenance_event.id",
        to: "maintenance_task.maintenance_event",
      },
      modelClass: MaintenanceTask,
      relation: Model.HasManyRelation,
    },
  };

  public static jsonSchema = {
    type: "object",

    properties: {
      id: {type: "integer"},

      appliance: {type: "integer"},
    },
    required: ["appliance"],
  };

  public id?: number;
  public updatedAt?: string;
  public createdAt?: string;
  public appliance?: number;

  public async $beforeUpdate() {
    delete this.id; // should not update id field
    delete this.createdAt; // should not update createdAt field
    delete this.appliance; // should not update appliance field

    this.updatedAt = new Date().toISOString();
  }

}
