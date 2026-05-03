import generateDeviceId from "@utils/userHeader/generate.device.id";
import { FastifyRequest, FastifyReply } from "fastify";
import {
  loginService,
  logoutService,
  refreshTokenService,
  registerService,
} from "@auth/auth.service";
import { LoginInput, RegisterInput } from "@auth/auth.types";
import { cookiesPrefences } from "@config/cookies";

export async function register(
  req: FastifyRequest<{ Body: RegisterInput }>,
  rep: FastifyReply,
) {
  await registerService(req.body);

  rep.ok("Account registered");
}

// Verify the user by login, then generate access and refresh tokens and set the cookies of them, by default 15 minutes for access token and 7 days for refresh token.
export async function login(
  req: FastifyRequest<{ Body: LoginInput }>,
  rep: FastifyReply,
) {
  const deviceId = generateDeviceId(req, rep); // Make the device id unique per client/domain.

  const {
    result,
    tokens: { accessToken, refreshToken },
  } = await loginService(req.body, deviceId);

  rep.setCookie("accessToken", accessToken, {
    ...cookiesPrefences.production,
    maxAge: 60 * 15,
  });

  rep.setCookie("refreshToken", refreshToken, {
    ...cookiesPrefences.production,
    maxAge: 60 * 60 * 24 * 7,
  });

  rep.ok("Login successful", result);
}

export async function logout(req: FastifyRequest, rep: FastifyReply) {
  const deviceId = req.cookies.deviceId;

  await logoutService(deviceId);

  rep.clearCookie("accessToken", {
    ...cookiesPrefences.production,
  });

  rep.clearCookie("refreshToken", {
    ...cookiesPrefences.production,
  });

  rep.ok("Logout successful");
}

export async function refreshToken(req: FastifyRequest, rep: FastifyReply) {
  const token = req.cookies.refreshToken;

  const deviceId = req.cookies.deviceId;

  const { newAccessToken, newRefreshToken } = await refreshTokenService(
    token,
    deviceId,
  );

  rep.setCookie("accessToken", newAccessToken, {
    ...cookiesPrefences.dev,
    maxAge: 60 * 15,
  });

  rep.setCookie("refreshToken", newRefreshToken, {
    ...cookiesPrefences.dev,
    maxAge: 60 * 60 * 24 * 7,
  });

  rep.ok("New tokens has been generated");
}
