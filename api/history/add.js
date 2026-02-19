const { verifyToken } = require("../lib/auth");
const connectToDatabase = require("../lib/db");
const cookie = require("cookie");

module.exports = async (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const cookies = cookie.parse(req.headers.cookie || "");
    req.cookies = cookies;
    const decoded = verifyToken(req);
    if (!decoded) {
        console.error("History add: Unauthorized");
        return res.status(401).json({ error: "Unauthorized" });
    }

    const { animeId, title, episode, image, timestamp } = req.body;
    if (!animeId || !title) {
        console.error("Data riwayat tidak lengkap");
        return res.status(400).json({ error: "Data riwayat tidak lengkap" });
    }

    try {
        const db = await connectToDatabase();
        const history = db.collection("history");

        const record = {
            userId: decoded.userId,
            animeId,
            title,
            episode: episode || 1,
            image: image || "",
            watchedAt: timestamp ? new Date(timestamp) : new Date()
        };

        const result = await history.insertOne(record);
        console.log(
            "Riwayat ditambahkan untuk user:",
            decoded.username,
            "anime:",
            title
        );
        res.status(201).json({
            message: "Riwayat tersimpan",
            id: result.insertedId
        });
    } catch (err) {
        console.error("Error menyimpan riwayat:", err);
        res.status(500).json({ error: "Terjadi kesalahan server" });
    }
};
