import { IParamMiddleware } from "koa-router";
import { Model } from "objection";
import { path } from "ramda";

export const secureOrganisation: IParamMiddleware = async (
  organisation,
  ctx,
  next
) => {
  const accountId = path(["state", "claims", "accountId"], ctx);
  // check if accountId and organisation defined (koa route params are strings)
  if (typeof organisation === "string" && typeof accountId === "number") {
    const result = await Model.raw(
      "SELECT is_admin FROM organisation_account WHERE account=?::integer AND organisation=?::integer",
      accountId,
      Number(organisation)
    );
    if (result.rows.length > 0) {
      ctx.state.rights = path(["rows", 0], result);
      return next();
    }
  }
  // if next not returned before, account isn't allowed to access route
  ctx.throw(401);
};
