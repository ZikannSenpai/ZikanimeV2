// pages/api/auth/me.js
import cookie from "cookie";
import { verify } from "../../../lib/jwt";
import clientPromise from "../../../lib/mongodb";

export default async function handler(req, res) {
    const cookies = cookie.parse(req.headers.cookie || "");
    const token = cookies.zktoken;
    if (!token) return res.status(401).json({ message: "not logged" });
    try {
        const payload = verify(token);
        const client = await clientPromise;
        const db = client.db(process.env.DB_NAME || "zikanime");
        const users = db.collection("users");
        const user = await users.findOne(
            { _id: new (require("mongodb").ObjectId)(payload.sub) },
            { projection: { password: 0 } }
        );
        res.json({ user });
    } catch (e) {
        return res.status(401).json({ message: "invalid token" });
    }
}
