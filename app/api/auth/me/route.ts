import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import User from "@/lib/models/User";

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get("token")?.value;
        if (!token)
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );

        const payload = verifyToken(token);
        if (!payload)
            return NextResponse.json(
                { error: "Invalid token" },
                { status: 401 }
            );

        await dbConnect();
        const user = await User.findById(payload.userId).select("-password");
        if (!user)
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );

        return NextResponse.json({ user });
    } catch {
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
