import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "./actions/auth/is-authenticated";
import { saveTrackingCookies } from "./actions/extras/utm";

const PUBLIC_ROUTES = ["/"];

const REQUIRED_COOKIES = [
  "sid",
  "full_name",
  "user_id",
  "user_lang",
  "system_user",
];

export async function proxy(req: NextRequest) {
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

  return saveTrackingCookies(req, NextResponse.next());
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
