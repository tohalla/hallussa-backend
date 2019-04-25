import { Model } from "objection";

export default class UserRole extends Model {
  public static tableName = "user_role";

  public id: number;
  public organisation?: number;
  public name: string;

  public allowCreateAppliance = false;
  public allowCreateMaintainer = false;
  public allowDeleteAppliance = false;
  public allowDeleteMaintainer = false;
  public allowDeleteOrganisation = false;
  public allowManageMaintenanceTask = false;
  public allowManageRoles = false;
  public allowUpdateAppliance = false;
  public allowUpdateMaintainer = false;
  public allowUpdateOrganisation = false;

  public $beforeUpdate(opt, queryContext) {
    delete this.id; // should not update id field
    delete this.organisation; // should not update organisation field
  }
}

export type RoleRights = Omit<Omit<UserRole, Model>, "id" | "organisation" | "name">;
