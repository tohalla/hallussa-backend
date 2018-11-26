import { Model } from "objection";

export default class ApplianceStatus extends Model {
  public static tableName = "appliance_status";

  public appliance?: number;
  public averageMaintenanceTime?: number;
  public maintenanceEventCount?: number;
  public isMalfunctioning?: boolean;
}
