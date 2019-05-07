import { Middleware } from "koa";
import { Model } from "objection";
import { path } from "ramda";
import { formatObjectKeys } from "../util/format";

export const secureOrganisation: Middleware = async (
  ctx,
  next
) => {
  ctx.state.rights = {};
  const accountId = path(["state", "claims", "accountId"], ctx);
  const {organisation} = ctx.params;

  if (typeof organisation !== "undefined" && typeof accountId === "number") {
    const result = await Model.raw(`
      SELECT
        user_role.allow_create_appliance,
        user_role.allow_create_maintainer,
        user_role.allow_delete_appliance,
        user_role.allow_delete_maintainer,
        user_role.allow_delete_organisation,
        user_role.allow_manage_maintenance_task,
        user_role.allow_manage_roles,
        user_role.allow_manage_users,
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
      ctx.state.rights = formatObjectKeys(path(["rows", 0], result));
      return next();
    }
  }
  // if next not returned before, account isn't allowed to access route
  return ctx.throw(401);
};
