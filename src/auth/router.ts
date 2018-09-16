import bcrypt from "bcryptjs";
import bodyParser from "koa-bodyparser";
import Router from "koa-router";
import { Model } from "objection";
import { path } from "ramda";

import { signToken, verify } from "./jwt";

export default new Router({prefix: "/auth"})
  .get("/", async (ctx) => { // renew JWT using old token
    const token: string = path(["header", "authorization"], ctx) || "";
    try {
      if (!token.startsWith("Bearer")) {
        throw new Error("provided token in wrong format");
      }
      const {accountId} = await verify(token.replace("Bearer ", ""));
      ctx.body = await signToken(accountId);
    } catch (e) {
      ctx.status = 401;
      throw e;
    }
  })
  .post("/", bodyParser(), async (ctx) => {
    const password = path(["request", "body", "password"], ctx);
    const email = path(["request", "body", "email"], ctx);
    if (typeof password !== "string" || typeof email !== "string") {
      return ctx.status = 401; // password and email not found in request
    }

    const result = await Model.raw("SELECT id, password FROM account WHERE email=?::text", email);
    const hashed = path(["rows", 0, "password"], result);
    const accountId = path(["rows", 0, "id"], result);

    if (typeof hashed === "string" && typeof accountId === "number" && await bcrypt.compare(password, hashed)) {
      ctx.body = await signToken(accountId);
    } else {
      ctx.status = 401; // account not found with provided credentials
    }
  });
