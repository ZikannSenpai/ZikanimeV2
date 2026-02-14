import { Low, JSONFile } from "lowdb";
import { verify } from "../../lib/jwt";
const adapter = new JSONFile("./data/db.json");
const db = new Low(adapter);

export default async function handler(req, res) {
    try {
        console.log("[user/history] method", req.method);
        const token = req.headers.authorization?.replace("Bearer ", "");
        const user = verify(token);
        if (!user) return res.status(401).json({ error: "unauth" });
        await db.read();
        db.data ||= { users: [], history: [] };
        if (req.method === "POST") {
            const { episode, animeTitle } = req.body;
            const item = {
                id: Date.now().toString(),
                userId: user.id,
                episode,
                animeTitle,
                at: new Date().toISOString()
            };
            db.data.history.push(item);
            await db.write();
            console.log("[user/history] saved", item.id);
            return res.status(200).json(item);
        } else if (req.method === "GET") {
            const hist = db.data.history
                .filter(h => h.userId === user.id)
                .slice(-50)
                .reverse();
            return res.status(200).json(hist);
        } else {
            res.status(405).end();
        }
    } catch (err) {
        console.error("[user/history] err", err.message);
        res.status(500).json({ error: err.message });
    }
}
