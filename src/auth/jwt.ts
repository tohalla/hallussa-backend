import jwt from "jsonwebtoken";
import { Middleware } from "koa";
import { path } from "ramda";

if (!process.env.JWT_SECRET) {
  throw Error("define JWT_SECRET environment variable");
}

export interface JWTPayload {
  // iss: string; // issuer
  // aud: string; // audience
  // sub: string; // principal
  iat: number; // issued at
  exp: number; // expiration time

  accountId: number;
}

export type Claims = JWTPayload;

export const signToken = (accountId: number) => new Promise((resolve, reject) => {
  if (!process.env.JWT_SECRET) {
    return reject(new Error("define JWT_SECRET environment variable"));
  }

  const payload: JWTPayload = {
    accountId,
    exp: Date.now() / 1000 + (60 * 60), // set expiry time to one hour from now
    iat: Date.now() / 1000,
  };

  jwt.sign(payload, process.env.JWT_SECRET, {algorithm: "HS256"}, (err, token) =>
    err ? reject(err) : resolve({token, expiresAt: payload.exp})
  );
});

export const verifyToken = (token: string) => new Promise<JWTPayload>((resolve, reject) =>
  jwt.verify(token, process.env.JWT_SECRET as string, (err, payload) =>
    err ? reject(err) : resolve(payload as JWTPayload)
  )
);

/**
 *  validated token passed in authorization header.
 *  If the token is valid, middleware sets ctx.state.claims to claims of the token
 */
export const jwtMiddleware: Middleware = async (ctx, next) => {
  const token: string = path(["header", "authorization"], ctx) || "";
  try {
    if (!token.startsWith("Bearer")) {
      throw {message: "error.misc.jwtFormat"};
    }
    ctx.state.claims = await verifyToken(token.replace("Bearer ", ""));
  } catch (e) {
    ctx.state.claims = undefined;
  }
  return next();
};

/**
 * jwtMiddleware should be used for this middleware to function properly
 */
export const secureRoute: Middleware = (ctx, next) =>
  typeof path(["state", "claims", "accountId"], ctx) === "number" ?
    next() : ctx.throw(401);
