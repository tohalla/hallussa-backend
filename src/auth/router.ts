import bcrypt from "bcryptjs";
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
      return ctx.throw(401);
    }
  })
  .post("/", bodyParser(), async (ctx) => {
    const password = path(["request", "body", "password"], ctx);
    const email = path(["request", "body", "email"], ctx);
    if (typeof password !== "string" || typeof email !== "string") {
      return ctx.throw(401, "Password and/or email not found in request");
    }

    const result = await Model.raw(
      "SELECT id, password FROM account WHERE email=?::text",
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
      ctx.throw(401, "Account not found with provided credentials");
    }
  });
