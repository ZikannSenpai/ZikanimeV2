const { verifyToken } = require("../lib/auth");
const connectToDatabase = require("../lib/db");
const cookie = require("cookie");

module.exports = async (req, res) => {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    // Parse cookie
    const cookies = cookie.parse(req.headers.cookie || "");
    req.cookies = cookies;

    const decoded = verifyToken(req);
    if (!decoded) {
        console.error("Profile: Token tidak valid atau tidak ada");
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const db = await connectToDatabase();
        const users = db.collection("users");

        const user = await users.findOne(
            { _id: decoded.userId },
            { projection: { password: 0 } } // Jangan kirim password
        );

        if (!user) {
            console.error("User tidak ditemukan untuk ID:", decoded.userId);
            return res.status(404).json({ error: "User tidak ditemukan" });
        }

        console.log("Profil diakses oleh:", decoded.username);
        res.status(200).json(user);
    } catch (err) {
        console.error("Error mengambil profil:", err);
        res.status(500).json({ error: "Terjadi kesalahan server" });
    }
};
