import bcrypt from "bcryptjs";
import i18n from "i18next";
import bodyParser from "koa-bodyparser";
import Router from "koa-router";
import { dissoc, path, prop } from "ramda";

import { checkRelationExpression } from "../../model/validation";
import { secureRoute } from "../jwt";
import Account from "./Account";

export default new Router({prefix: "/accounts"})
  .get("/", secureRoute, async (ctx) => {
    if (!checkRelationExpression(Account, ctx.query.eager)) {
      return ctx.throw(400, i18n.t("error.misc.invalidRelationExpression", {lng: ctx.headers["Accept-Language"]}));
    }
    const accountId = path(["state", "claims", "accountId"], ctx);
    ctx.body = await Account
      .query()
      .select()
      .where("id", "=", accountId)
      .eager(ctx.query.eager)
      .modifyEager("organisations", (builder) => builder.select("organisation", "user_role"))
      .first();
  })
  .post("/", bodyParser(), async (ctx) => {
    try {
      if (!ctx.request.body) {
        return ctx.throw(400);
      }
      ctx.body = await Account
        .query()
        .insert(ctx.request.body)
        .returning("*");
      ctx.status = 201;
    } catch (e) {
      if (typeof e === "object") {
        if (e.constraint === "account_email_unique") {
          ctx.throw(
            409,
            i18n.t(
              "error.account.uniqueEmail",
              {email: path(["request", "body", "email"], ctx), lng: ctx.headers["Accept-Language"]}
            )
          );
        }
      }
      throw e;
    }
  })
  .use(secureRoute)
  .patch("/:account", bodyParser(), async (ctx) => {
    ctx.body = await Account.query().patch(
      dissoc("password", ctx.request.body || {}) // use separate route for updating password
    ).returning("*").first();
  })
  .put("/:account/password", bodyParser(), async (ctx) => {
    const {account} = ctx.params;
    const {password, currentPassword, retypePassword} = ctx.request.body as {[key: string]: string};

    if (typeof password !== "string" || typeof currentPassword !== "string" || password !== retypePassword) {
      ctx.throw(401, i18n.t("error.account.passwordsDoNotMatch", {lng: ctx.headers["Accept-Language"]}));
    }

    const hashed = prop("password", await Account.query().select("password").where("id", account).first());

    if (typeof hashed === "string" && (await bcrypt.compare(currentPassword, hashed))) {
      await Account.query().patch({password}).where("id", account);
      ctx.status = 200;
    } else {
      ctx.throw(401, i18n.t("error.account.invalidCurrentPassword", {lng: ctx.headers["Accept-Language"]}));
    }
  });
