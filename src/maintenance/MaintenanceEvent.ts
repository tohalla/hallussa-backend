import { Model, QueryContext, snakeCaseMappers, transaction } from "objection";
import { map, path } from "ramda";
import MaintenanceTask from "./MaintenanceTask";

export default class MaintenanceEvent extends Model {
  static get columnNameMappers() {
    return snakeCaseMappers();
  }

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
  public resolvedAt?: string;
  public description?: string;
  public appliance?: number;
  public assignedTo?: number;

  public async $beforeInsert(queryContext: QueryContext) {
    const preExistingMaintenanceEvent = await MaintenanceEvent
      .query(queryContext.transaction)
      .select()
      .whereNull("resolved_at")
      .andWhere("appliance", this.appliance)
      .first();
    if (preExistingMaintenanceEvent) { // TODO: Add description to possible additional_information table
      throw { status: 409, message: "error.maintenance.event.duplicate" };
    }
  }

  // should create maintenance task for each maintainer assigned to the appliance
  // when new maintenance event is created
  public async $afterInsert(queryContext: QueryContext) {
    // fetch list of maintainers assigned to the appliance
    const maintainers = map(
      (am) => am.maintainer,
      (await queryContext.transaction.raw(
        "SELECT maintainer FROM appliance_maintainer WHERE appliance=?::integer",
        this.appliance as number
      )).rows
    );

    if (maintainers.length > 0) {
      // create task for maintainers
      await MaintenanceTask
        .query(queryContext.transaction)
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

  public async assign(taskHash?: string) {
    if (typeof taskHash !== "string") {
      throw { status: 400, message: "error.maintenance.task.notFound" };
    }
    // should not be able assign task if it's already assigned
    if (this.assignedTo) { return false; }
    const trx = await transaction.start(MaintenanceTask.knex());
    try {
      // attempt to assign task
      const maintainer = path(
        ["maintainer"],
        await MaintenanceTask
          .query(trx)
          .select("maintainer")
          .where("hash", "=", taskHash)
          .andWhere("maintenance_event", "=", this.id)
          .first()
      ) as number | undefined;

      if (!maintainer) {
        throw { status: 400, message: "error.maintainer.notFound" };
      }

      // delete tasks assigned to other maintainers
      await MaintenanceTask
        .query(trx)
        .delete()
        .where("hash", "!=", taskHash)
        .andWhere("maintenance_event", "=", this.id);

      // set selected maintainer responsible of the maintenance
      await MaintenanceEvent.query(trx).patch({
        assignedTo: maintainer,
      });

      trx.commit(); // commit changes
      this.assignedTo = maintainer;
    } catch (e) {
      // should roll back if something failed
      trx.rollback();
      throw e;
    }
  }
}
