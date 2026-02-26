import dbConnect from "../../../lib/mongodb";
import User from "../../../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
    if (req.method !== "POST")
        return res.status(405).json({ message: "Method not allowed" });
    const { username, password } = req.body || {};
    if (!username || !password)
        return res.status(400).json({ message: "Missing fields" });
    await dbConnect();
    const u = await User.findOne({ username });
    if (!u) return res.status(401).json({ message: "Invalid credentials" });
    const ok = await bcrypt.compare(password, u.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });
    const token = jwt.sign(
        { sub: u._id, username: u.username },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
    res.status(200).json({
        token,
        user: { id: u._id, username: u.username, lastWatched: u.lastWatched }
    });
}
