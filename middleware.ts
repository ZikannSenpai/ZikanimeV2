import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJWT } from "./lib/auth";

export async function middleware(request: NextRequest) {
    if (request.nextUrl.pathname === "/login") {
        const token = request.cookies.get("token")?.value;
        if (token) {
            try {
                const payload = await verifyJWT(token);
                if (payload)
                    return NextResponse.redirect(new URL("/", request.url));
            } catch {}
        }
        return NextResponse.next();
    }

    const token = request.cookies.get("token")?.value;
    if (!token) return NextResponse.redirect(new URL("/login", request.url));

    try {
        const payload = await verifyJWT(token);
        if (!payload)
            return NextResponse.redirect(new URL("/login", request.url));

        const requestHeaders = new Headers(request.headers);
        requestHeaders.set("x-user-id", payload.userId);
        return NextResponse.next({
            request: { headers: requestHeaders }
        });
    } catch {
        return NextResponse.redirect(new URL("/login", request.url));
    }
}

export const config = {
    matcher: ["/((?!api/auth|_next/static|favicon.ico).*)"]
};
