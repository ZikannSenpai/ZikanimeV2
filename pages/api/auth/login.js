import { Low, JSONFile } from "lowdb";
import bcrypt from "bcryptjs";
import { sign } from "../../../lib/jwt";

const adapter = new JSONFile("./data/db.json");
const db = new Low(adapter);

export default async function handler(req, res) {
    console.log("[auth/login] body", req.body?.email);
    try {
        await db.read();
        db.data ||= { users: [], history: [] };
        const { email, password } = req.body;
        const user = db.data.users.find(u => u.email === email);
        if (!user) return res.status(400).json({ error: "no_user" });
        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return res.status(401).json({ error: "invalid" });
        const token = sign(user);
        console.log("[auth/login] success", user.id);
        res.status(200).json({
            token,
            user: { id: user.id, email: user.email, name: user.name }
        });
    } catch (err) {
        console.error("[auth/login] err", err.message);
        res.status(500).json({ error: err.message });
    }
}
