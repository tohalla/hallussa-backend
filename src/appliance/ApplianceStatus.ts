import { Model, snakeCaseMappers } from "objection";

export default class ApplianceStatus extends Model {
  static get columnNameMappers() {
    return snakeCaseMappers();
  }

  public static tableName = "appliance_status";

  public appliance?: number;
  public averageMaintenanceTime?: number;
  public maintenanceEventCount?: number;
  public isMalfunctioning?: boolean;
}
