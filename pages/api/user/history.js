// pages/api/user/history.js
import cookie from "cookie";
import { verify } from "../../../lib/jwt";
import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
    const cookies = cookie.parse(req.headers.cookie || "");
    const token = cookies.zktoken;
    if (!token) return res.status(401).json({ message: "not logged" });
    try {
        const payload = verify(token);
        const client = await clientPromise;
        const db = client.db(process.env.DB_NAME || "zikanime");
        const users = db.collection("users");
        const uid = new ObjectId(payload.sub);

        if (req.method === "POST") {
            const { animeId, title, episode, poster } = req.body;
            await users.updateOne(
                { _id: uid },
                {
                    $set: {
                        last_watched: {
                            animeId,
                            title,
                            episode,
                            poster,
                            at: new Date()
                        }
                    }
                }
            );
            return res.json({ ok: true });
        }

        if (req.method === "GET") {
            const u = await users.findOne(
                { _id: uid },
                { projection: { last_watched: 1 } }
            );
            return res.json({ last_watched: u?.last_watched || null });
        }
        res.status(405).end();
    } catch (e) {
        res.status(401).json({ message: "invalid token" });
    }
}
