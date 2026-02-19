import clientPromise from "../../lib/mongodb";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
    console.log("[api/history] method", req.method);
    const token =
        req.cookies?.token || (req.headers.cookie || "").split("token=")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || "devsecret"
        );
        const client = await clientPromise;
        const db = client.db("zikanime");
        const users = db.collection("users");

        if (req.method === "POST") {
            const { animeSlug, title } = req.body || {};
            console.log("[api/history] add", { animeSlug, title });
            await users.updateOne(
                { _id: new ObjectId(decoded.sub) },
                { $push: { history: { animeSlug, title, at: new Date() } } }
            );
            return res.status(200).json({ ok: true });
        }

        if (req.method === "GET") {
            const user = await users.findOne(
                { _id: new ObjectId(decoded.sub) },
                { projection: { history: 1 } }
            );
            return res.status(200).json({ history: user?.history || [] });
        }

        res.status(405).json({ error: "Method not allowed" });
    } catch (err) {
        console.error("[api/history] error", err);
        res.status(500).json({ error: err.message });
    }
}
