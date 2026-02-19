const bcrypt = require("bcryptjs");
const connectToDatabase = require("../lib/db");

module.exports = async (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { username, password } = req.body;
    console.log("Register attempt:", username);

    if (!username || !password) {
        console.error("Username atau password tidak lengkap");
        return res
            .status(400)
            .json({ error: "Username dan password diperlukan" });
    }

    try {
        const db = await connectToDatabase();
        const users = db.collection("users");

        // Cek apakah user sudah ada
        const existing = await users.findOne({ username });
        if (existing) {
            console.error("Username sudah terdaftar:", username);
            return res.status(400).json({ error: "Username sudah digunakan" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await users.insertOne({
            username,
            password: hashedPassword,
            createdAt: new Date()
        });

        console.log(
            "User berhasil didaftarkan:",
            username,
            "ID:",
            result.insertedId
        );
        res.status(201).json({ message: "Registrasi berhasil" });
    } catch (err) {
        console.error("Error saat registrasi:", err);
        res.status(500).json({ error: "Terjadi kesalahan server" });
    }
};
