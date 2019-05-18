import { Model, snakeCaseMappers } from "objection";

export default class MaintenanceEvent extends Model {
  static get columnNameMappers() {
    return snakeCaseMappers();
  }

  public static tableName = "scheduled_maintenance";

  public static jsonSchema = {
    type: "object",

    properties: {
      id: {type: "integer"},

      appliance: {type: "integer"},
      description: {type: "string"},
    },
    required: ["appliance"],
  };

  public id?: number;
  public updatedAt?: string;
  public createdAt?: string;
  public description?: string;
  public appliance?: number;

  public async $beforeUpdate() {
    delete this.id; // should not update id field
    delete this.createdAt; // should not update createdAt field
    delete this.appliance; // should not update appliance field

    this.updatedAt = new Date().toISOString();
  }

}
