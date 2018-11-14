import { Model } from "objection";

export default class ApplianceMaintainer extends Model {
  public static tableName = "appliance_maintainer";
  public appliance?: number;
  public maintainer?: number;
}
