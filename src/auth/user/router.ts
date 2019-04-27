import Router from "koa-router";
import { raw } from "objection";
import Account from "../account/Account";

export default new Router({ prefix: "/users" })
  .get("/accounts", async (ctx) => {
    // organisation param set in parent router
    const { organisation } = ctx.params;
    ctx.body = await Account
      .query()
      .join(
        "organisation_account",
        (builder) => builder
          .on(raw("organisation_account.organisation = ?::integer", organisation))
          .andOn("organisation_account.account", "account.id")
      )
      .select();
  });
