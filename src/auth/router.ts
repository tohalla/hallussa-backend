import bcrypt from "bcryptjs";
import i18n from "i18next";
import bodyParser from "koa-bodyparser";
import Router from "koa-router";
import { Model } from "objection";
import { path } from "ramda";

import { signToken } from "./jwt";

export default new Router({ prefix: "/auth" })
  .get("/", async (ctx) => {
    // renew JWT using old token
    const accountId = path(["state", "claims", "accountId"], ctx);
    if (typeof accountId === "number") {
      ctx.body = await signToken(accountId);
    } else {
      return ctx.throw(401, i18n.t("error.authentication.invalidCredentials", {lng: ctx.headers["Accept-Language"]}));
    }
  })
  .post("/", bodyParser(), async (ctx) => {
    const password = path(["request", "body", "password"], ctx);
    const email = path(["request", "body", "email"], ctx);
    if (typeof password !== "string" || typeof email !== "string") {
      return ctx.throw(
        401,
        i18n.t("error.authentication.passwordOrEmailMissing", {lng: ctx.headers["Accept-Language"]})
      );
    }

    const result = await Model.raw(
      "SELECT id, password FROM account WHERE LOWER(email)=LOWER(?::text)",
      email
    );
    const hashed = path(["rows", 0, "password"], result);
    const accountId = path(["rows", 0, "id"], result);

    if (
      typeof hashed === "string" &&
      typeof accountId === "number" &&
      (await bcrypt.compare(password, hashed))
    ) {
      ctx.body = await signToken(accountId);
    } else {
      ctx.throw(
        404,
        i18n.t("error.authentication.invalidCredentials", {lng: ctx.get("Accept-Language")})
      );
    }
  });
