import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./lib/auth";

export function middleware(request: NextRequest) {
    const token = request.cookies.get("token")?.value;
    const { pathname } = request.nextUrl;

    // Jika mengakses halaman utama atau anime detail, harus login
    if (pathname === "/" || pathname.startsWith("/anime/")) {
        if (!token) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
        const payload = verifyToken(token);
        if (!payload) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    // Jika sudah login, jangan akses login/register
    if ((pathname === "/login" || pathname === "/register") && token) {
        const payload = verifyToken(token);
        if (payload) {
            return NextResponse.redirect(new URL("/", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/", "/anime/:path*", "/login", "/register"]
};
