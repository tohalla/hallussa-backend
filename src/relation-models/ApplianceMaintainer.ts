import { Model, snakeCaseMappers } from "objection";

export default class ApplianceMaintainer extends Model {
  static get columnNameMappers() {
    return snakeCaseMappers();
  }

  public static tableName = "appliance_maintainer";
  public appliance?: number;
  public maintainer?: number;
}
