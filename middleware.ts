import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { nextAuthSecret } from "@/lib/auth-secret";

const protectedPagePrefixes = [
  "/dashboard",
  "/settings",
  "/conversation",
  "/image",
  "/music",
  "/video",
  "/code",
];

const publicApiPrefixes = ["/api/auth", "/api/webhook"];

const isProtectedPage = (pathname: string) =>
  protectedPagePrefixes.some((prefix) => pathname.startsWith(prefix));

const isProtectedApi = (pathname: string) =>
  pathname.startsWith("/api") &&
  !publicApiPrefixes.some((prefix) => pathname.startsWith(prefix));

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = await getToken({
    req: request,
    secret: nextAuthSecret,
  });

  const isLoggedIn = Boolean(token);

  if (isLoggedIn && (pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up"))) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!isLoggedIn && isProtectedApi(pathname)) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  if (!isLoggedIn && isProtectedPage(pathname)) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
