import clientPromise from "../../../lib/mongodb";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
    console.log("[api/auth/login] method", req.method);
    if (req.method !== "POST")
        return res.status(405).json({ error: "Method not allowed" });

    const { email, password } = req.body || {};
    console.log("[api/auth/login] body", { email });

    if (!email || !password)
        return res.status(400).json({ error: "Missing email/password" });

    try {
        const client = await clientPromise;
        const db = client.db("zikanime");
        const users = db.collection("users");

        const user = await users.findOne({ email, password });
        if (!user)
            return res.status(401).json({ error: "Invalid credentials" });

        const token = jwt.sign(
            { sub: user._id.toString(), email },
            process.env.JWT_SECRET || "devsecret",
            { expiresIn: "30d" }
        );
        res.setHeader(
            "Set-Cookie",
            `token=${token}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24 * 30}`
        );
        res.status(200).json({
            ok: true,
            user: { email: user.email, name: user.name }
        });
    } catch (err) {
        console.error("[api/auth/login] error", err);
        res.status(500).json({ error: err.message });
    }
}
