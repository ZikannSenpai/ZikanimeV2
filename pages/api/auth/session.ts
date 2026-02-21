import { NextApiRequest, NextApiResponse } from "next";
import { verifyJWT } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
        const payload = await verifyJWT(token);
        if (!payload) return res.status(401).json({ message: "Invalid token" });

        const client = await clientPromise;
        const db = client.db();
        const user = await db
            .collection("users")
            .findOne(
                { _id: new ObjectId(payload.userId) },
                { projection: { password: 0 } }
            );

        if (!user) return res.status(401).json({ message: "User not found" });
        res.status(200).json({ user });
    } catch {
        res.status(401).json({ message: "Unauthorized" });
    }
}
