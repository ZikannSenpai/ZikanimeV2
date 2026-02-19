import clientPromise from "../../../lib/mongodb";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
    console.log("[api/auth/me] cookie", req.headers.cookie);
    const token =
        req.cookies?.token || (req.headers.cookie || "").split("token=")[1];
    if (!token) return res.status(200).json({ user: null });

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || "devsecret"
        );
        console.log("[api/auth/me] decoded", decoded);

        const client = await clientPromise;
        const db = client.db("zikanime");
        const users = db.collection("users");
        const user = await users.findOne(
            { _id: new (require("mongodb").ObjectId)(decoded.sub) },
            { projection: { password: 0 } }
        );
        res.status(200).json({ user });
    } catch (err) {
        console.error("[api/auth/me] error", err);
        res.status(401).json({ user: null, error: err.message });
    }
}
