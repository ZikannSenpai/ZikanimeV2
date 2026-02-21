import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import { comparePassword, signJWT } from "@/lib/auth";
import cookie from "cookie";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "POST")
        return res.status(405).json({ message: "Method not allowed" });

    const { username, password } = req.body;
    if (!username || !password)
        return res.status(400).json({ message: "Missing fields" });

    try {
        const client = await clientPromise;
        const db = client.db();
        const users = db.collection<User>("users");

        const user = await users.findOne({ username });
        if (!user)
            return res.status(401).json({ message: "Invalid credentials" });

        const isValid = await comparePassword(password, user.password);
        if (!isValid)
            return res.status(401).json({ message: "Invalid credentials" });

        const token = signJWT({
            userId: user._id.toString(),
            username: user.username
        });

        res.setHeader(
            "Set-Cookie",
            cookie.serialize("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: 60 * 60 * 24 * 7
            })
        );

        res.status(200).json({
            message: "Login successful",
            user: { username: user.username, email: user.email }
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}
