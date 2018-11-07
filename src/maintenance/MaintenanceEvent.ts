import { Model } from "objection";
import { map } from "ramda";
import MaintenanceTask from "./MaintenanceTask";

export default class MaintenanceEvent extends Model {
  public static tableName = "maintenance_event";

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

  // should create maintenance task for each maintainer assigned to the appliance
  // when new maintenance event is created
  public async $afterInsert() {
    // fetch list of maintainers assigned to the appliance
    const maintainers = map(
      (am) => am.maintainer,
      (await Model.raw(
        "SELECT maintainer FROM appliance_maintainer WHERE appliance=?::integer",
        this.appliance as number
      )).rows
    );

    if (maintainers.length > 0) {
      // create task for maintainers
      await MaintenanceTask
        .query()
        .insert(
          map((maintainer) => ({
            maintainer,
            maintenanceEvent: this.id,
          }) ,maintainers)
        ).returning("hash");
    }
  }

  public async $beforeUpdate() {
    delete this.id; // should not update id field
    delete this.createdAt; // should not update createdAt field
    delete this.appliance; // should not update appliance field

    this.updatedAt = new Date().toISOString();
  }

}
