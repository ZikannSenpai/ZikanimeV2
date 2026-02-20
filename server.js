const express = require("express");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const fs = require("fs").promises;
const path = require("path");
const axios = require("axios");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(
    session({
        secret: "zikanime-secret-key",
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }
    })
);

// Path ke file JSON
const usersFile = path.join(__dirname, "data", "users.json");
const historyFile = path.join(__dirname, "data", "history.json");

// Fungsi baca/tulis JSON
async function readJSON(file) {
    try {
        const data = await fs.readFile(file, "utf8");
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading ${file}:`, error);
        return [];
    }
}

async function writeJSON(file, data) {
    try {
        await fs.writeFile(file, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error(`Error writing ${file}:`, error);
    }
}

// Inisialisasi file JSON
async function initDataFiles() {
    try {
        await fs.mkdir(path.join(__dirname, "data"), { recursive: true });
        try {
            await fs.access(usersFile);
        } catch {
            await writeJSON(usersFile, []);
        }
        try {
            await fs.access(historyFile);
        } catch {
            await writeJSON(historyFile, []);
        }
    } catch (error) {
        console.error("Error initializing data files:", error);
    }
}
initDataFiles();

// ========== API Routes ==========
// Registrasi
app.post("/api/register", async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res
                .status(400)
                .json({ error: "Username dan password diperlukan" });
        }

        const users = await readJSON(usersFile);
        if (users.find(u => u.username === username)) {
            return res.status(400).json({ error: "Username sudah digunakan" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            id: Date.now().toString(),
            username,
            password: hashedPassword,
            createdAt: new Date().toISOString()
        };
        users.push(newUser);
        await writeJSON(usersFile, users);

        req.session.userId = newUser.id;
        req.session.username = newUser.username;

        res.json({
            success: true,
            user: { id: newUser.id, username: newUser.username }
        });
    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({ error: "Terjadi kesalahan server" });
    }
});

// Login
app.post("/api/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        const users = await readJSON(usersFile);
        const user = users.find(u => u.username === username);

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res
                .status(401)
                .json({ error: "Username atau password salah" });
        }

        req.session.userId = user.id;
        req.session.username = user.username;

        res.json({
            success: true,
            user: { id: user.id, username: user.username }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Terjadi kesalahan server" });
    }
});

// Logout
app.post("/api/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error("Logout error:", err);
            return res.status(500).json({ error: "Gagal logout" });
        }
        res.json({ success: true });
    });
});

// Cek session
app.get("/api/me", (req, res) => {
    if (req.session.userId) {
        res.json({
            loggedIn: true,
            user: { id: req.session.userId, username: req.session.username }
        });
    } else {
        res.json({ loggedIn: false });
    }
});

// Simpan riwayat
app.post("/api/history", async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ error: "Harus login" });
        }

        const { animeId, title, episode, image, slug } = req.body;
        const history = await readJSON(historyFile);

        // Hapus duplikat
        const filtered = history.filter(
            h =>
                !(
                    h.userId === req.session.userId &&
                    h.animeId === animeId &&
                    h.episode === episode
                )
        );

        filtered.push({
            userId: req.session.userId,
            animeId,
            slug: slug || "",
            title,
            episode,
            image,
            timestamp: new Date().toISOString()
        });

        // Batasi 50 riwayat per user
        const userHistory = filtered.filter(
            h => h.userId === req.session.userId
        );
        if (userHistory.length > 50) {
            const sorted = userHistory.sort(
                (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
            );
            const keepIds = sorted
                .slice(0, 50)
                .map(
                    h => `${h.userId}-${h.animeId}-${h.episode}-${h.timestamp}`
                );
            const finalHistory = filtered.filter(
                h =>
                    h.userId !== req.session.userId ||
                    keepIds.includes(
                        `${h.userId}-${h.animeId}-${h.episode}-${h.timestamp}`
                    )
            );
            await writeJSON(historyFile, finalHistory);
        } else {
            await writeJSON(historyFile, filtered);
        }

        res.json({ success: true });
    } catch (error) {
        console.error("History save error:", error);
        res.status(500).json({ error: "Gagal menyimpan riwayat" });
    }
});

// Ambil riwayat user
app.get("/api/history", async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ error: "Harus login" });
        }

        const history = await readJSON(historyFile);
        const userHistory = history
            .filter(h => h.userId === req.session.userId)
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        res.json(userHistory);
    } catch (error) {
        console.error("History fetch error:", error);
        res.status(500).json({ error: "Gagal mengambil riwayat" });
    }
});

// ========== Proxy API Anime ==========
const API_BASE = "https://www.sankavollerei.com/anime/kura";

app.get("/api/anime/*", async (req, res) => {
    try {
        const endpoint = req.params[0];
        const url = `${API_BASE}/${endpoint}${req.url.replace(/^\/api\/anime\/[^\/]+/, "")}`;
        console.log("Proxying to:", url);

        const response = await axios.get(url, {
            timeout: 30000,
            headers: { "User-Agent": "Zikanime/1.0" }
        });

        res.json(response.data);
    } catch (error) {
        console.error("API Proxy error:", error.message);
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({ error: "Gagal mengambil data dari API" });
        }
    }
});

// Serve frontend
app.get("*", (req, res) => {
    if (req.path.startsWith("/api/")) return;
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
