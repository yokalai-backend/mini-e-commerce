import jwt from "jsonwebtoken";
import crypto from "crypto";
import env from "../../config/env";
import { TokenPayload } from "../../../modules/auth/auth.types";

export function signAccessToken(payload: TokenPayload, expires?: any) {
  return jwt.sign(payload, env.ACCESS_SECRET, {
    expiresIn: expires || "15m",
  });
}

export function signRefreshToken(payload: Partial<TokenPayload>) {
  const jti = crypto.randomUUID();

  const refreshToken = jwt.sign({ ...payload, jti }, env.REFRESH_SECRET, {
    expiresIn: "7d",
  });

  return { refreshToken, jti };
}
