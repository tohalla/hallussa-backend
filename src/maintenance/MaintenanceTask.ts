import { Model, transaction } from "objection";
import Maintainer from "../maintainer/Maintainer";
import MaintenanceEvent from "./MaintenanceEvent";

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
  public isAccepted?: boolean;
  public isAvailable?: boolean;

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

  public async acceptTask() {
    // should not be able to accept task if it is unavailable
    if (this.isAvailable === false) { return false; }
    const trx = await transaction.start(MaintenanceTask);
    try {
      // attempt to assign task
      await MaintenanceTask.query(trx).patch({
        isAccepted: true,
        isAvailable: false,
      })
        .where("maintenance_event", "=", this.maintenanceEvent)
        .andWhere("hash", "=", this.hash);
      // set all other tasks unavailable
      await MaintenanceTask.query().patch({isAvailable: false})
        .where("maintenance_event", "=", this.maintenanceEvent)
        .andWhere("hash", "!=", this.hash);

      trx.commit();

      this.isAccepted = true;
      this.isAvailable = false;

      return true;
    } catch (e) {
      // should roll back somethign failed
      trx.rollback();
      return false;
    }
  }
}
