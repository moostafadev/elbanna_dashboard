import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth/constants";
import { verifySessionToken } from "@/lib/auth/session";

const LOGIN_PATH = "/login";

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const session = await verifySessionToken(
    request.cookies.get(SESSION_COOKIE)?.value,
  );

  if (pathname === LOGIN_PATH) {
    return session
      ? NextResponse.redirect(new URL("/", request.url))
      : NextResponse.next();
  }

  if (session) return NextResponse.next();

  const loginUrl = new URL(LOGIN_PATH, request.url);
  if (pathname !== "/")
    loginUrl.searchParams.set("from", `${pathname}${search}`);

  const response = NextResponse.redirect(loginUrl);
  if (request.cookies.has(SESSION_COOKIE))
    response.cookies.delete(SESSION_COOKIE);

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
