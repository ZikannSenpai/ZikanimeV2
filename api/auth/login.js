const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const connectToDatabase = require("../lib/db");
const cookie = require("cookie");

module.exports = async (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { username, password } = req.body;
    console.log("Login attempt:", username);

    if (!username || !password) {
        console.error("Kredensial tidak lengkap");
        return res
            .status(400)
            .json({ error: "Username dan password diperlukan" });
    }

    try {
        const db = await connectToDatabase();
        const users = db.collection("users");

        const user = await users.findOne({ username });
        if (!user) {
            console.error("User tidak ditemukan:", username);
            return res
                .status(401)
                .json({ error: "Username atau password salah" });
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            console.error("Password salah untuk user:", username);
            return res
                .status(401)
                .json({ error: "Username atau password salah" });
        }

        // Buat token
        const token = jwt.sign(
            { userId: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Set cookie httpOnly
        res.setHeader(
            "Set-Cookie",
            cookie.serialize("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 60 * 60 * 24 * 7, // 7 hari
                path: "/"
            })
        );

        console.log("Login berhasil:", username);
        res.status(200).json({ message: "Login berhasil", token }); // token juga dikirim untuk localStorage opsional
    } catch (err) {
        console.error("Error saat login:", err);
        res.status(500).json({ error: "Terjadi kesalahan server" });
    }
};
