import { Model } from "objection";

export default class MaintenanceTask extends Model {
  public static tableName = "maintenance_task";

  public static jsonSchema = {
    type: "object",

    properties: {
      id: {type: "integer"},

      maintainer: {type: "integer"},
      maintenanceEvent: {type: "integer"},
    },
    required: ["maintenanceEvent", "maintainer"],
  };

  public id?: number;
  public updatedAt?: string;
  public createdAt?: string;
  public hash?: string;
  public maintenanceEvent?: number;
  public maintainer?: number;

  public async $beforeUpdate() {
    delete this.id; // should not update id field
    delete this.hash; // should not update hash field
    delete this.createdAt; // should not update createdAt field
    delete this.maintenanceEvent; // should not update maintenance event field
    delete this.maintainer; // should not update maintainer field

    this.updatedAt = new Date().toISOString();
  }

  public async $afterInsert() {
    // TODO: inform maintainer via email
  }

}
