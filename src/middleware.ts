import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "./actions/auth/is-authenticated";
import { saveTrackingCookies } from "./actions/extras/utm";

const PUBLIC_ROUTES = ["/", "/login", "/schedule"];

const REQUIRED_COOKIES = [
  "sid",
  "full_name",
  "user_id",
  "user_lang",
  "system_user",
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return saveTrackingCookies(req, NextResponse.next());
  }

  const isLoggedIn = await isAuthenticated();
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  if (!isLoggedIn) {
    if (isPublicRoute) {
      return saveTrackingCookies(req, NextResponse.next());
    }

    const response = NextResponse.redirect(new URL("/?type=login", req.url));

    REQUIRED_COOKIES.forEach((cookie) => {
      response.cookies.delete(cookie);
    });

    return saveTrackingCookies(req, response);
  }

  if (pathname === "/") {
    return saveTrackingCookies(
      req,
      NextResponse.redirect(new URL("/dashboard", req.url)),
    );
  }

  // Sync sid cookie to frappe_sid for the interview scheduler
  const sid = req.cookies.get("sid")?.value;
  const frappeSid = req.cookies.get("frappe_sid")?.value;
  if (sid && frappeSid !== sid) {
    const response = NextResponse.next();
    response.cookies.set("frappe_sid", sid, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 86400,
      path: "/",
    });
    return saveTrackingCookies(req, response);
  }

  return saveTrackingCookies(req, NextResponse.next());
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
