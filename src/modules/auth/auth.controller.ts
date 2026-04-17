import generateDeviceId from "@utils/userHeader/generate.device.id";
import { FastifyRequest, FastifyReply } from "fastify";
import {
  loginService,
  logoutService,
  refreshTokenService,
  registerService,
} from "@auth/auth.service";
import { LoginInput, RegisterInput } from "@auth/auth.types";

export async function register(
  req: FastifyRequest<{ Body: RegisterInput }>,
  rep: FastifyReply,
) {
  await registerService(req.body);

  rep.ok("Account registered");
}

export async function login(
  req: FastifyRequest<{ Body: LoginInput }>,
  rep: FastifyReply,
) {
  const deviceId = generateDeviceId(req, rep);

  const { accessToken, refreshToken } = await loginService(req.body, deviceId);

  rep.setCookie("refreshToken", refreshToken, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    maxAge: 60 * 60 * 24 * 7,
  });

  rep.ok("Login successful", { accessToken });
}

export async function logout(req: FastifyRequest, rep: FastifyReply) {
  const token = req.cookies.refreshToken;

  await logoutService(token);

  rep.clearCookie("refreshToken", {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: false,
  });

  rep.ok("Logout successful");
}

export async function refreshToken(req: FastifyRequest, rep: FastifyReply) {
  const token = req.cookies.refreshToken;

  const deviceId = req.cookies.deviceId;

  console.log("token: ", token, "deviceId: ", deviceId);

  const { newAccessToken, newRefreshToken } = await refreshTokenService(
    token,
    deviceId,
  );

  rep.setCookie("refreshToken", newRefreshToken, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    maxAge: 60 * 60 * 24 * 7,
  });

  rep.ok("Received new access token", { accessToken: newAccessToken });
}
