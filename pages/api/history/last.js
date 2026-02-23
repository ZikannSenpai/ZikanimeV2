import dbConnect from "../../../lib/db";
import History from "../../../models/History";
import { verifyToken } from "../../../lib/auth";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
        return res.status(401).json({ message: "Invalid token" });
    }

    await dbConnect();

    try {
        const last = await History.findOne({ userId: decoded.id })
            .sort({ watchedAt: -1 })
            .limit(1);
        res.status(200).json({ last });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}
