import { Low, JSONFile } from "lowdb";
import { verify } from "../../../lib/jwt";

const adapter = new JSONFile("./data/db.json");
const db = new Low(adapter);

export default async function handler(req, res) {
    console.log("[auth/me] headers", req.headers.authorization?.slice(0, 10));
    try {
        const token = req.headers.authorization?.replace("Bearer ", "");
        const user = verify(token);
        if (!user) return res.status(401).json({ error: "unauth" });
        await db.read();
        db.data ||= { users: [], history: [] };
        const u = db.data.users.find(x => x.id === user.id);
        const history = db.data.history
            .filter(h => h.userId === user.id)
            .slice(-30)
            .reverse();
        console.log("[auth/me] ok", u?.email);
        res.status(200).json({
            user: { id: u.id, email: u.email, name: u.name },
            history
        });
    } catch (err) {
        console.error("[auth/me] err", err.message);
        res.status(500).json({ error: err.message });
    }
}
