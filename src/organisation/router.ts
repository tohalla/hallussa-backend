import bodyParser from "koa-bodyparser";
import Router from "koa-router";
import { path } from "ramda";

import { transaction } from "objection";
import applianceRouter from "../appliance/router";
import { secureRoute } from "../auth/jwt";
import maintainerRouter from "../maintainer/router";
import { secureOrganisation } from "./middleware";
import Organisation, { OrganisationAccountRelation } from "./Organisation";

const router = new Router({ prefix: "/organisations" })
  .use(secureRoute)
  .get("/", async (ctx) => {
    const accountID = path(["state", "claims", "accountId"], ctx);
    // TODO: Should organisations be public? if so, limit public data
    ctx.body = await Organisation
      .query()
      .select()
      .joinRaw(
        "JOIN organisation_account ON organisation_account.account=?::integer " +
        "AND organisation_account.organisation=organisation.id",
        accountID
      );
  })
  .post("/", secureRoute, bodyParser(), async (ctx) => {
    const trx = await transaction.start(Organisation);
    try {
      // attempt to create a new organisation
      const organisation = await Organisation.query(trx).insert(
        ctx.request.body || {}
      ).returning("*");

      // add current account to created organisation with admin rights
      await organisation
        .$relatedQuery("accounts", trx)
        .relate<OrganisationAccountRelation>({
          id: ctx.state.claims.accountId,
          isAdmin: true,
        });

      trx.commit();
      ctx.body = organisation;
      ctx.status = 201;
    } catch (e) {
      // should roll back organisation creation if couldn't link it to account
      trx.rollback();
      throw e;
    }
  });

router
  // account must be authenticated and a member of the organisation to access its routes
  .param("organisation", secureOrganisation)
  .get("/:organisation", async (ctx) => {
    ctx.body = await Organisation.query()
      .select()
      .where("id", "=", ctx.params.organisation)
      .first();
  })
  .use("/:organisation", applianceRouter.routes(), applianceRouter.allowedMethods())
  .use("/:organisation", maintainerRouter.routes(), maintainerRouter.allowedMethods());

export default router;
