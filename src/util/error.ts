import i18n from "i18next";
import { Middleware } from "koa";
import { NotFoundError } from "objection";

export const errorHandling: Middleware = async (ctx, next) => {
  try {
    await next();
  } catch (e) {
    if (Array.isArray(e)) {
      ctx.throw(...e);
    }
    ctx.throw(
      i18n.t(e.message, {defaultValue: e.message, lng: ctx.headers["Accept-Language"]}),
      e instanceof NotFoundError ? 400 : e.status || 500
    );
  }
};
