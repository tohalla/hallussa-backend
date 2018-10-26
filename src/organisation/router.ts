import bodyParser from "koa-bodyparser";
import Router from "koa-router";

import { transaction } from "objection";
import applianceRouter from "../appliance/router";
import { secureRoute } from "../auth/jwt";
import { secureOrganisation } from "./middleware";
import Organisation, { OrganisationAccountRelation } from "./Organisation";

const router = new Router({ prefix: "/organisations" })
  .get("/", async (ctx) => {
    // TODO: Should organisations be public? if so, limit public data
    ctx.body = await Organisation.query().select();
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

  // create separate router for organisation level routes
const organisationRouter = [applianceRouter]
  .reduce((prev, r) =>
    prev.use(r.routes(), r.allowedMethods()),
    new Router({prefix: "/:organisation"})
      .get("/", async (ctx) => {
        ctx.body = await Organisation.query()
          .select()
          .where("id", "=", ctx.params.organisation)
          .first();
      })
      );

router
  // account must be authenticated and a member of the organisation to access its routes
  .use(secureRoute).param("organisation", secureOrganisation)
  .use(
    organisationRouter.routes(), organisationRouter.allowedMethods()
  );

export default router;
