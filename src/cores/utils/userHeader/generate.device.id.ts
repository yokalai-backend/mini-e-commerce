import { FastifyReply, FastifyRequest } from "fastify";
import { cookiesPrefences } from "@config/cookies";
import crypto from "crypto";

// Generate a unique device id for supporting multi device login, generate new if user doesn't have one or it's been expired where the life session is 30 days.
export default function generateDeviceId(
  req: FastifyRequest,
  rep: FastifyReply,
) {
  let deviceId = req.cookies.deviceId;

  if (!deviceId) {
    deviceId = crypto.randomUUID();

    rep.setCookie("deviceId", deviceId, {
      ...cookiesPrefences.production,
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  return deviceId;
}
