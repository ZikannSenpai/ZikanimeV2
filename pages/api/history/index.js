import dbConnect from "../../../lib/db";
import History from "../../../models/History";
import { verifyToken } from "../../../lib/auth";

export default async function handler(req, res) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
        return res.status(401).json({ message: "Invalid token" });
    }

    await dbConnect();

    if (req.method === "GET") {
        try {
            const history = await History.find({ userId: decoded.id })
                .sort({ watchedAt: -1 })
                .limit(20);
            res.status(200).json({ history });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    } else if (req.method === "POST") {
        const { animeId, animeTitle, episode, poster } = req.body;
        if (!animeId || !animeTitle || !episode) {
            return res.status(400).json({ message: "Missing fields" });
        }

        try {
            const history = await History.create({
                userId: decoded.id,
                animeId,
                animeTitle,
                episode,
                poster
            });
            res.status(201).json({ history });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
}
