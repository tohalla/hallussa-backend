import { Model, snakeCaseMappers } from "objection";

export default class RepetitiveMaintenance extends Model {
  static get columnNameMappers() {
    return snakeCaseMappers();
  }

  public static tableName = "repetitive_maintenance";

  public static jsonSchema = {
    type: "object",

    properties: {
      id: {type: "integer"},

      appliance: {type: "integer"},
      description: {type: "string"},
    },
    required: ["appliance", "interval"],
  };

  public id?: number;
  public updatedAt?: string;
  public createdAt?: string;
  public previousTrigger?: string;
  public enabled?: boolean;
  public interval?: number;
  public description?: string;
  public appliance?: number;

  public async $beforeUpdate() {
    delete this.id; // should not update id field
    delete this.createdAt; // should not update createdAt field
    delete this.appliance; // should not update appliance field

    this.updatedAt = new Date().toISOString();
  }

}
