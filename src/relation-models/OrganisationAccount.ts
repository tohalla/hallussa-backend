import { Model } from "objection";

export default class OrganisationAccount extends Model {
  public static tableName = "organisation_account";
  public isAdmin?: boolean;
  public organisation?: number;
  public account?: number;
}
