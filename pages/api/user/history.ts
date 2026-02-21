import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { verifyJWT } from "@/lib/auth";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    let userId: string;
    try {
        const payload = await verifyJWT(token);
        if (!payload) throw new Error();
        userId = payload.userId;
    } catch {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const client = await clientPromise;
    const db = client.db();
    const historyCollection = db.collection("history");

    if (req.method === "POST") {
        const { animeId, animeTitle, episode, episodeTitle, image } = req.body;
        if (!animeId || !episode)
            return res.status(400).json({ message: "Missing fields" });

        await historyCollection.insertOne({
            userId: new ObjectId(userId),
            animeId,
            animeTitle,
            episode,
            episodeTitle,
            image,
            watchedAt: new Date()
        });
        return res.status(201).json({ message: "History saved" });
    }

    if (req.method === "GET") {
        const history = await historyCollection
            .find({ userId: new ObjectId(userId) })
            .sort({ watchedAt: -1 })
            .limit(50)
            .toArray();
        return res.status(200).json({ history });
    }

    res.status(405).json({ message: "Method not allowed" });
}
