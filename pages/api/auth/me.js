import dbConnect from "../../../lib/mongodb";
import User from "../../../models/User";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
    const auth = req.headers.authorization || "";
    const token = auth.replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: "No token" });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        await dbConnect();
        const u = await User.findById(decoded.sub).select("-passwordHash");
        if (!u) return res.status(404).json({ message: "User not found" });
        res.status(200).json({ user: u });
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
}
