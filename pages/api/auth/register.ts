import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import { hashPassword } from "@/lib/auth";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "POST")
        return res.status(405).json({ message: "Method not allowed" });

    const { username, email, password } = req.body;
    if (!username || !email || !password)
        return res.status(400).json({ message: "Missing fields" });

    try {
        const client = await clientPromise;
        const db = client.db();
        const users = db.collection<User>("users");

        const existing = await users.findOne({
            $or: [{ email }, { username }]
        });
        if (existing)
            return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await hashPassword(password);
        await users.insertOne({
            username,
            email,
            password: hashedPassword,
            createdAt: new Date()
        });

        res.status(201).json({ message: "User created" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}
