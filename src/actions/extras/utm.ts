import { NextRequest, NextResponse } from "next/server";

export function saveTrackingCookies(req: NextRequest, res: NextResponse) {
  const params = req.nextUrl.searchParams;

  const trackingParams: Record<string, string> = {};

  for (const [key, value] of params.entries()) {
    if (
      key.startsWith("utm_") ||
      ["gclid", "fbclid", "msclkid", "ttclid"].includes(key)
    ) {
      trackingParams[key] = value;
    }
  }

  if (Object.keys(trackingParams).length > 0) {
    res.cookies.set("tracking_params", JSON.stringify(trackingParams), {
      maxAge: 60 * 60 * 24 * 90,
      path: "/",
      httpOnly: false,
      sameSite: "lax",
    });
  }

  return res;
}
