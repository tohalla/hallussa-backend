import { Model, snakeCaseMappers } from "objection";

export default class OrganisationAccount extends Model {
  static get columnNameMappers() {
    return snakeCaseMappers();
  }

  public static tableName = "organisation_account";

  public organisation?: number;
  public account?: number;
  public userRole?: number;
}
