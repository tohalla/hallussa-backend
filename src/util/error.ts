import { Middleware } from "koa";
import { NotFoundError } from "objection";

export const errorHandling: Middleware = async (ctx, next) => {
  try {
    await next();
  } catch (e) {
    if (e instanceof NotFoundError) {
      ctx.status = 400;
      ctx.body = e.message;
    } else {
      // TODO: should we log errors somewhere?
      ctx.status = e.status || 500;
      ctx.body = e.message;
    }
  }
};
