import { NextApiRequest } from "next";
import { IncomingMessage } from "http";

export function isServerless() {
  return !!(process.env.VERCEL || false) || !!(process.env.SERVERLESS || false);
}

export const getAccessTokenFromCookie = (
  req: NextApiRequest | IncomingMessage
) => {
  try {
    return (
      req?.headers?.cookie
        .split(";")
        .find((val) => val?.includes(process.env.NEXT_PUBLIC_TOKEN_COOKIE_NAME))
        ?.split("=")[1] ?? null
    );
  } catch (e) {
    return null;
  }
};

export function site_url(path: string) {
  if (process.browser) {
    return path;
  }
  // reference for vercel.com
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}${path}`;
  }
  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}${path}`;
}
