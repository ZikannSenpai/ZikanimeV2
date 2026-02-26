import dbConnect from "../../../lib/mongodb";
import User from "../../../models/User";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
    if (req.method !== "POST")
        return res.status(405).json({ message: "Method not allowed" });
    const { username, email, password } = req.body || {};
    if (!username || !password)
        return res.status(400).json({ message: "Missing fields" });
    await dbConnect();
    const exists = await User.findOne({ username });
    if (exists) return res.status(409).json({ message: "Username taken" });
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const u = await User.create({ username, email, passwordHash: hash });
    res.status(201).json({ id: u._id, username: u.username, email: u.email });
}
