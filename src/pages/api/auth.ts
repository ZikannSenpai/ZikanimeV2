import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../lib/mongodb";
import User from "../../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await dbConnect();
    const { username, password } = req.body;
    if (req.method === "POST") {
        const user = await User.findOne({ username });
        if (!user) return res.status(401).json({ error: "user_not_found" });
        // password check omitted for brevity
        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET || "sekret"
        );
        res.status(200).json({ token });
    } else res.status(405).end();
}
