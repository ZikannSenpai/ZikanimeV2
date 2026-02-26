import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/lib/models/User";
import { comparePassword, createToken, setCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password required" },
                { status: 400 }
            );
        }

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            );
        }

        const isValid = await comparePassword(password, user.password);
        if (!isValid) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            );
        }

        const token = createToken(user._id.toString());
        const response = NextResponse.json({
            message: "Login successful",
            user: { id: user._id, username: user.username, email: user.email }
        });
        setCookie(response, token);
        return response;
    } catch (error) {
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
