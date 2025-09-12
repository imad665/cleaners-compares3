import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // If the user is not logged in and trying to access /orders
  if (!token && req.nextUrl.pathname.startsWith("/orders")) {
    const url = req.nextUrl.clone();
    url.pathname = "/"; // redirect to homepage
    return NextResponse.redirect(url);
  }

  // Allow the request
  return NextResponse.next();
}

// Define which paths middleware applies to
export const config = {
  matcher: ["/orders/:path*"], // apply to /orders and all subpaths
};
