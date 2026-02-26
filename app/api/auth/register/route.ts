import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/lib/models/User";
import { hashPassword } from "@/lib/auth";

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const { username, email, password } = await req.json();

        if (!username || !email || !password) {
            return NextResponse.json(
                { error: "All fields required" },
                { status: 400 }
            );
        }

        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });
        if (existingUser) {
            return NextResponse.json(
                { error: "User already exists" },
                { status: 400 }
            );
        }

        const hashed = await hashPassword(password);
        const user = await User.create({ username, email, password: hashed });

        return NextResponse.json(
            { message: "User created", userId: user._id },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
