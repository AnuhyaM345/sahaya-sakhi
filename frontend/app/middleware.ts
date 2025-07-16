import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  const protectedPaths = ["/admin-dashboard", "/user-dashboard"];
  const currentPath = req.nextUrl.pathname;

  // Skip middleware for non-protected paths
  if (!protectedPaths.some(path => currentPath.startsWith(path))) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const decoded = JSON.parse(atob(token.split(".")[1]));
    const role = decoded.role;
    const url = req.nextUrl.clone();

    if (role === "admin" && url.pathname.startsWith("/user-dashboard")) {
      return NextResponse.redirect(new URL("/admin-dashboard", req.url));
    }

    if (role === "user" && url.pathname.startsWith("/admin-dashboard")) {
      return NextResponse.redirect(new URL("/user-dashboard", req.url));
    }

    return NextResponse.next();
  } catch (err) {
    console.error("Invalid or malformed token:", err);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

// Apply middleware only to these routes
export const config = {
  matcher: ["/admin-dashboard", "/user-dashboard"],
};
