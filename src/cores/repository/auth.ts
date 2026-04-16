import { queryOne } from "../utils/query/query";
import {
  signAccessToken,
  signRefreshToken,
} from "../utils/token/generate.token";
import {
  RegisterInput,
  LoginInput,
  TokenPayload,
} from "../../modules/auth/auth.types";
import { Roles } from "../../shared/types";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import env from "../config/env";
import Errors from "../errors/errors";

export async function registerRepo(input: RegisterInput): Promise<void> {
  const { username, password, email } = input;

  await queryOne(
    `INSERT INTO users (username, hash, email) VALUES ($1, $2, $3) RETURNING created_at`,
    [username, password, email],
  );
}

export async function loginRepo(input: LoginInput) {
  const { email } = input;

  return await queryOne<{
    id: string;
    username: string;
    role: Roles;
    hash: string;
  }>(
    `SELECT id, username, role, hash FROM users WHERE email = $1 AND is_active = true`,
    [email],
  );
}

export async function loginHelper(payload: TokenPayload, deviceId: string) {
  const accessToken = signAccessToken(payload, "5m");

  await queryOne("DELETE FROM refresh_tokens WHERE device_id = $1", [deviceId]); // Delete previous token

  const { refreshToken, jti } = signRefreshToken({ id: payload.id });

  await queryOne(
    `INSERT INTO refresh_tokens (user_id, jti, device_id, expires_at) VALUES ($1, $2, $3, NOW() + INTERVAL '7 days')`,
    [payload.id, jti, deviceId],
  );

  return { accessToken, refreshToken };
}

export async function logoutHelper(token: string) {
  const { jti } = jwt.verify(token, env.REFRESH_SECRET, {
    ignoreExpiration: true,
  }) as { jti: string };

  const deleteToken = await queryOne(
    `DELETE FROM refresh_tokens WHERE jti = $1 RETURNING id`,
    [jti],
  );

  if (!deleteToken) throw Errors.badRequest("Already logout");
}

export async function refreshTokenHelper(token: string, deviceId: string) {
  try {
    const { id, jti } = jwt.verify(token, env.REFRESH_SECRET) as {
      id: string;
      jti: string;
    };

    const checkToken = await queryOne(
      `SELECT id FROM refresh_tokens WHERE user_id = $1 AND revoked = false AND expires_at > NOW()`,
      [id],
    );

    if (!checkToken) {
      await queryOne(`DELETE FROM refresh_tokens WHERE device_id = $1`, [
        deviceId,
      ]);

      throw Errors.authorization("Request declined try to re-login");
    }

    const revoked = await queryOne(
      `DELETE FROM refresh_tokens WHERE jti = $1 RETURNING *`,
      [jti],
    );

    if (!revoked) {
      await queryOne(`DELETE FROM refresh_tokens WHERE user_id = $1`, [id]);

      throw Errors.authorization(
        "Token reuse detected, force logout",
        "TOKEN_REUSE",
      );
    }

    const payload = await queryOne<{
      id: string;
      username: string;
      role: Roles;
    }>(
      `SELECT id, username, role FROM users WHERE id = $1 AND is_active = true`,
      [id],
    );

    const newAccessToken = signAccessToken(payload);

    const refToken = signRefreshToken({ id });

    await queryOne(
      `INSERT INTO refresh_tokens (user_id, jti, device_id, expires_at) VALUES ($1, $2, $3, NOW() + INTERVAL '7 days')`,
      [id, refToken.jti, deviceId],
    ); // Rotation

    return { newAccessToken, newRefreshToken: refToken.refreshToken };
  } catch (error) {
    if (error instanceof TokenExpiredError)
      throw Errors.authorization("Token expired", "TOKEN_EXPIRED");

    if (error instanceof JsonWebTokenError)
      throw Errors.authorization("Token invalid", "TOKEN_INVALID");

    throw error;
  }
}
