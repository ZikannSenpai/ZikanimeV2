// pages/api/user/profile.js
import jwt from "jsonwebtoken";
import { connectToDatabase } from "../../../lib/mongodb";

function getTokenFromReq(req) {
    const cookie = req.headers.cookie || "";
    const match = cookie
        .split(";")
        .map(s => s.trim())
        .find(s => s.startsWith("zikanime_token="));
    if (!match) return null;
    return match.split("=")[1];
}

export default async function handler(req, res) {
    const token = getTokenFromReq(req);
    if (!token) return res.status(401).json({ error: "unauth" });
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const { db } = await connectToDatabase();
        const user = await db
            .collection("users")
            .findOne(
                { _id: new (require("mongodb").ObjectId)(payload.sub) },
                { projection: { passwordHash: 0 } }
            );
        if (!user) return res.status(404).json({ error: "no_user" });
        res.json({ user });
    } catch (err) {
        res.status(401).json({ error: "invalid" });
    }
}
