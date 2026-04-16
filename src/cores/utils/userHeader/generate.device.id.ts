import { FastifyReply, FastifyRequest } from "fastify";
import crypto from "crypto";

export default function generateDeviceId(
  req: FastifyRequest,
  rep: FastifyReply,
) {
  let deviceId = req.cookies.deviceId;

  if (!deviceId) {
    deviceId = crypto.randomUUID();

    rep.setCookie("deviceId", deviceId, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });
  }

  return deviceId;
}
