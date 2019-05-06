import { Model, snakeCaseMappers } from "objection";
import UserRole from "../auth/user-role/UserRole";

export default class OrganisationAccount extends Model {
  static get columnNameMappers() {
    return snakeCaseMappers();
  }

  public static tableName = "organisation_account";

  public static relationMappings = {
    userRole: {
      join: {
        from: "organisation_account.user_role",
        to: "user_role.id",
      },
      modelClass: UserRole,
      relation: Model.HasOneRelation,
    },
  };

  public organisation?: number;
  public account?: number;
  public userRole: number;
}
