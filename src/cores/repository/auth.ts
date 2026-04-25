import env from "@config/env";
import Errors from "@errors/errors";
import { queryOne } from "@utils/query/query";
import { signAccessToken, signRefreshToken } from "@utils/token/generate.token";
import { RegisterInput, LoginInput, TokenPayload } from "@auth/auth.types";
import { Roles } from "@shared/types";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

export async function registerHelper(input: RegisterInput): Promise<void> {
  const { username, password, email } = input;

  await queryOne(
    `INSERT INTO users (username, hash, email) VALUES ($1, $2, $3) RETURNING created_at`,
    [username, password, email],
  );
}

export async function loginHelper(input: LoginInput) {
  const { email } = input;

  return await queryOne<{
    id: string;
    username: string;
    role: Roles;
    hash: string;
  }>(
    `SELECT id, username, role, hash FROM users WHERE email = $1 AND is_active = true`,
    [email], // Only able to login if the user still active.
  );
}

// Could handle multiple device login but limited only 5 per account.
export async function handleLogin(payload: TokenPayload, deviceId: string) {
  const accessToken = signAccessToken(payload); // Generate a new accessToken.

  await queryOne("DELETE FROM refresh_tokens WHERE device_id = $1", [deviceId]); // Delete previous refresh token.

  const { refreshToken, jti } = signRefreshToken({ id: payload.id }); // Generate a new token while returning the jti so we can save the jti into database.

  await queryOne(
    `INSERT INTO refresh_tokens (user_id, jti, device_id, expires_at) VALUES ($1, $2, $3, NOW() + INTERVAL '7 days')`,
    [payload.id, jti, deviceId],
  );

  return { accessToken, refreshToken };
}

export async function handleLogout(deviceId: string) {
  const deleteToken = await queryOne(
    `DELETE FROM refresh_tokens WHERE device_id = $1 RETURNING id`,
    [deviceId],
  ); // Delete the refresh tokens from this device id.

  if (!deleteToken) throw Errors.badRequest("User already logout");
}

export async function refreshTokenHelper(token: string, deviceId: string) {
  try {
    const { id, jti } = jwt.verify(token, env.REFRESH_SECRET) as {
      id: string;
      jti: string;
    };

    const tokenExists = await queryOne(
      `SELECT id FROM refresh_tokens WHERE jti = $1 AND revoked = false AND expires_at > NOW()`,
      [jti],
    ); // Check out if the token has been reused or if it's not valid in the database.

    if (!tokenExists) {
      await queryOne(`DELETE FROM refresh_tokens WHERE user_id = $1`, [id]);

      throw Errors.authorization("Request denied, please login again");
    } // If the token has been revoked and someone try to use it or if it's not recognized by the database then force logout to all devices connected with the user, for the security purpose.

    await queryOne(`DELETE FROM refresh_tokens WHERE jti = $1 RETURNING *`, [
      jti,
    ]);

    const accessTokenPayload = await queryOne<{
      id: string;
      username: string;
      role: Roles;
    }>(
      `SELECT id, username, role FROM users WHERE id = $1 AND is_active = true`,
      [id],
    );

    const newAccessToken = signAccessToken(accessTokenPayload);

    const refToken = signRefreshToken({ id });

    await queryOne(
      `INSERT INTO refresh_tokens (user_id, jti, device_id, expires_at) VALUES ($1, $2, $3, NOW() + INTERVAL '7 days')`,
      [id, refToken.jti, deviceId],
    ); // Rotation, making a new refresh token to be use.

    return { newAccessToken, newRefreshToken: refToken.refreshToken };
  } catch (error) {
    if (error instanceof TokenExpiredError)
      throw Errors.authorization("Token expired", "TOKEN_EXPIRED");

    if (error instanceof JsonWebTokenError)
      throw Errors.authorization("Token invalid", "TOKEN_INVALID");

    throw error;
  }
}
