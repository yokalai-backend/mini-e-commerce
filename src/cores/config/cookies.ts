import { CookieSerializeOptions } from "fastify-cookie";

export const cookiesPrefences: {
  dev: CookieSerializeOptions;
  production: CookieSerializeOptions;
} = {
  dev: {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: false,
  },
  production: {
    path: "/",
    httpOnly: true,
    sameSite: "none",
    secure: true,
  },
};
