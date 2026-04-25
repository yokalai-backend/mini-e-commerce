import jwt from "jsonwebtoken";
import crypto from "crypto";
import env from "@config/env";
import { TokenPayload } from "@auth/auth.types";

// Well as you can see these two function are the generator modules for helps me generate access and refresh tokens, this is crucial and make the codes cleaner.
export function signAccessToken(payload: TokenPayload) {
  return jwt.sign(payload, env.ACCESS_SECRET, {
    expiresIn: "15m",
  });
}

export function signRefreshToken(payload: Partial<TokenPayload>) {
  const jti = crypto.randomUUID();

  const refreshToken = jwt.sign({ ...payload, jti }, env.REFRESH_SECRET, {
    expiresIn: "7d",
  });

  return { refreshToken, jti };
}
