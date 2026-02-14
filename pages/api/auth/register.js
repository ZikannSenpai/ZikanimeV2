import { Low, JSONFile } from "lowdb";
import bcrypt from "bcryptjs";
import { sign } from "../../../lib/jwt";

const adapter = new JSONFile("./data/db.json");
const db = new Low(adapter);

export default async function handler(req, res) {
    console.log("[auth/register] body", req.body?.email);
    try {
        await db.read();
        db.data ||= { users: [], history: [] };
        const { email, password, name } = req.body;
        if (!email || !password)
            return res.status(400).json({ error: "missing" });
        const exists = db.data.users.find(u => u.email === email);
        if (exists) return res.status(400).json({ error: "email_exists" });
        const hashed = await bcrypt.hash(password, 8);
        const user = {
            id: Date.now().toString(),
            email,
            name: name || "",
            password: hashed,
            createdAt: new Date().toISOString()
        };
        db.data.users.push(user);
        await db.write();
        const token = sign(user);
        console.log("[auth/register] success", user.id);
        res.status(200).json({
            token,
            user: { id: user.id, email: user.email, name: user.name }
        });
    } catch (err) {
        console.error("[auth/register] err", err.message);
        res.status(500).json({ error: err.message });
    }
}
