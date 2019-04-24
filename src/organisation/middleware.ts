import { IParamMiddleware } from "koa-router";
import { Model } from "objection";
import { path } from "ramda";

export const mapRoleRights: IParamMiddleware = async (
  organisation,
  ctx,
  next
) => {
  const accountId = path(["state", "claims", "accountId"], ctx);
  // check if accountId and organisation defined (koa route params are strings)
  if (typeof organisation === "string" && typeof accountId === "number") {
    const result = await Model.raw(`
      SELECT
        user_role.allow_create_appliance,
        user_role.allow_create_maintainer,
        user_role.allow_delete_appliance,
        user_role.allow_delete_maintainer,
        user_role.allow_delete_organisation,
        user_role.allow_manage_maintenance_task,
        user_role.allow_manage_roles,
        user_role.allow_update_appliance,
        user_role.allow_update_maintainer,
        user_role.allow_update_organisation
      FROM organisation_account
        JOIN user_role ON organisation_account.user_role = user_role.id
          AND COALESCE(user_role.organisation, :organisation:::integer) = :organisation:::integer
      WHERE organisation_account.account=:account:::integer
        AND organisation_account.organisation=:organisation:::integer
      `,
      {
        account: accountId,
        organisation: Number(organisation),
      }
    );
    if (result.rows.length > 0) {
      ctx.state.rights = path(["rows", 0], result);
      return next();
    }
  }
  // if next not returned before, account isn't allowed to access route
  ctx.throw(401);
};
