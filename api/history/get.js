const { verifyToken } = require("../lib/auth");
const connectToDatabase = require("../lib/db");
const cookie = require("cookie");

module.exports = async (req, res) => {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const cookies = cookie.parse(req.headers.cookie || "");
    req.cookies = cookies;
    const decoded = verifyToken(req);
    if (!decoded) {
        console.error("History get: Unauthorized");
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const db = await connectToDatabase();
        const history = db.collection("history");

        const records = await history
            .find({ userId: decoded.userId })
            .sort({ watchedAt: -1 })
            .limit(50)
            .toArray();

        console.log(
            "Riwayat diambil untuk user:",
            decoded.username,
            "jumlah:",
            records.length
        );
        res.status(200).json(records);
    } catch (err) {
        console.error("Error mengambil riwayat:", err);
        res.status(500).json({ error: "Terjadi kesalahan server" });
    }
};
