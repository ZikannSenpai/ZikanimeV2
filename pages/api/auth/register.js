import clientPromise from "../../../lib/mongodb";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
    console.log("[api/auth/register] method", req.method);
    if (req.method !== "POST")
        return res.status(405).json({ error: "Method not allowed" });

    const { email, password, name } = req.body || {};
    console.log("[api/auth/register] body", { email, name });

    if (!email || !password)
        return res.status(400).json({ error: "Missing email/password" });

    try {
        const client = await clientPromise;
        const db = client.db("zikanime");
        const users = db.collection("users");

        const existing = await users.findOne({ email });
        if (existing) return res.status(409).json({ error: "User exists" });

        const user = {
            email,
            password,
            name: name || "",
            createdAt: new Date(),
            history: []
        };
        const insert = await users.insertOne(user);
        console.log("[api/auth/register] user inserted", insert.insertedId);

        const token = jwt.sign(
            { sub: insert.insertedId.toString(), email },
            process.env.JWT_SECRET || "devsecret",
            { expiresIn: "30d" }
        );

        res.setHeader(
            "Set-Cookie",
            `token=${token}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24 * 30}`
        );
        res.status(201).json({ ok: true, user: { email, name } });
    } catch (err) {
        console.error("[api/auth/register] error", err);
        res.status(500).json({ error: err.message });
    }
}
