import jwt from "jsonwebtoken";

export interface JWTPayload {
  // iss: string; // issuer
  // aud: string; // audience
  // sub: string; // principal
  iat: number; // issued at
  exp: number; // expiration time

  accountId: number;
}

export const signToken = ({accountId}: {accountId: number}) => new Promise((resolve, reject) => {
  if (!process.env.JWT_SECRET) {
    return reject(new Error("define JWT_SECRET environment variable"));
  }

  const payload: JWTPayload = {
    accountId,
    exp: Date.now() / 1000 + (60 * 60),
    iat: Date.now() / 1000,
  };

  jwt.sign(payload, process.env.JWT_SECRET, {algorithm: "HS256"}, (err, token) =>
    err ? reject(err) : resolve({token, expiresAt: payload.exp})
  );
});

export const verify = (token: string) => new Promise((resolve, reject) => {
  if (!process.env.JWT_SECRET) {
    return reject(new Error("define JWT_SECRET environment variable"));
  }
   // TODO: also issuer and subject should be verified here
  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => err ? reject(err) : resolve(payload));
});
