// ==================== KONFIGURASI ====================
const API_BASE = "/api"; // karena di Vercel, relatif
const ANIME_API = "https://www.sankavollerei.com/anime/";

// ==================== UTILITY ====================
async function fetchAPI(url, options = {}) {
    console.log(`Fetching: ${url}`, options);
    try {
        const res = await fetch(url, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...options.headers
            }
        });
        const data = await res.json();
        console.log(`Response from ${url}:`, data);
        if (!res.ok) {
            throw new Error(data.error || "Terjadi kesalahan");
        }
        return data;
    } catch (err) {
        console.error(`Error fetching ${url}:`, err);
        throw err;
    }
}

// ==================== AUTH ====================
async function login(username, password) {
    return fetchAPI(`${API_BASE}/auth/login`, {
        method: "POST",
        body: JSON.stringify({ username, password })
    });
}

async function register(username, password) {
    return fetchAPI(`${API_BASE}/auth/register`, {
        method: "POST",
        body: JSON.stringify({ username, password })
    });
}

async function logout() {
    return fetchAPI(`${API_BASE}/auth/logout`, { method: "POST" });
}

async function getProfile() {
    return fetchAPI(`${API_BASE}/auth/profile`);
}

// ==================== HISTORY ====================
async function addHistory(anime) {
    // anime: { animeId, title, episode, image }
    console.log("Menambah riwayat:", anime);
    return fetchAPI(`${API_BASE}/history/add`, {
        method: "POST",
        body: JSON.stringify(anime)
    });
}

async function getHistory() {
    return fetchAPI(`${API_BASE}/history/get`);
}

// ==================== FETCH ANIME ====================
async function fetchAnimeList() {
    console.log("Mengambil daftar anime dari Sankavollerei...");
    try {
        const res = await fetch(ANIME_API);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        console.log("Data anime:", data);
        return data; // Asumsikan array anime
    } catch (err) {
        console.error("Gagal mengambil anime:", err);
        return [];
    }
}

// ==================== RENDER ANIME ====================
function renderAnimeCards(animeList, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = "";
    animeList.forEach(anime => {
        const card = document.createElement("div");
        card.className = "anime-card press-effect";
        card.dataset.id = anime.id || anime.mal_id || anime.slug; // sesuaikan dengan struktur API
        card.dataset.title = anime.title;
        card.dataset.image = anime.image || anime.images?.jpg?.image_url || "";

        card.innerHTML = `
            <img src="${anime.image || "https://via.placeholder.com/200x300?text=No+Image"}" alt="${anime.title}" loading="lazy">
            <div class="info">
                <div class="title">${anime.title}</div>
                <div class="episode">Episode: ${anime.episodes || "?"}</div>
            </div>
        `;

        card.addEventListener("click", () => {
            // Efek sudah dari CSS, tambah riwayat jika user login
            onAnimeClick(anime);
        });

        container.appendChild(card);
    });
}

// ==================== KLIK ANIME ====================
async function onAnimeClick(anime) {
    console.log("Anime diklik:", anime);
    // Cek apakah user login dengan memanggil profile (tanpa redirect)
    try {
        const profile = await getProfile(); // jika error, user tidak login
        // Login, simpan riwayat
        await addHistory({
            animeId: anime.id || anime.mal_id || anime.slug,
            title: anime.title,
            episode: 1, // default
            image: anime.image || anime.images?.jpg?.image_url || ""
        });
        alert(`Menonton ${anime.title} - episode 1 (riwayat tersimpan)`);
    } catch (err) {
        // Tidak login, arahkan ke login
        if (
            confirm("Anda harus login untuk menyimpan riwayat. Login sekarang?")
        ) {
            window.location.href = "/login";
        }
    }
}

// ==================== INIT ====================
document.addEventListener("DOMContentLoaded", () => {
    console.log("Zikanime siap!");

    // Highlight menu aktif berdasarkan URL
    const currentPath = window.location.pathname;
    document.querySelectorAll(".nav-link").forEach(link => {
        if (link.getAttribute("href") === currentPath) {
            link.classList.add("active");
        }
    });

    // Jika di halaman utama, muat anime
    if (document.getElementById("anime-grid")) {
        loadHomePage();
    }

    // Jika di halaman login, handle form
    if (document.getElementById("login-form")) {
        handleLoginForm();
    }

    // Jika di halaman register (opsional, bisa satu halaman dengan login)
    if (document.getElementById("register-form")) {
        handleRegisterForm();
    }

    // Jika di halaman profile
    if (document.getElementById("profile-info")) {
        loadProfile();
    }

    // Jika di halaman riwayat
    if (document.getElementById("history-list")) {
        loadHistory();
    }
});

async function loadHomePage() {
    const animeList = await fetchAnimeList();
    renderAnimeCards(animeList, "anime-grid");
}

function handleLoginForm() {
    const form = document.getElementById("login-form");
    const errorDiv = document.getElementById("login-error");

    form.addEventListener("submit", async e => {
        e.preventDefault();
        const username = form.username.value;
        const password = form.password.value;

        try {
            await login(username, password);
            window.location.href = "/";
        } catch (err) {
            errorDiv.textContent = err.message;
        }
    });
}

function handleRegisterForm() {
    const form = document.getElementById("register-form");
    const errorDiv = document.getElementById("register-error");

    form.addEventListener("submit", async e => {
        e.preventDefault();
        const username = form.username.value;
        const password = form.password.value;

        try {
            await register(username, password);
            alert("Registrasi berhasil, silakan login");
            window.location.href = "/login";
        } catch (err) {
            errorDiv.textContent = err.message;
        }
    });
}

async function loadProfile() {
    try {
        const profile = await getProfile();
        document.getElementById("profile-username").textContent =
            profile.username;
        document.getElementById("profile-created").textContent = new Date(
            profile.createdAt
        ).toLocaleString();
    } catch (err) {
        // Tidak login, redirect ke login
        window.location.href = "/login";
    }
}

async function loadHistory() {
    try {
        const history = await getHistory();
        const list = document.getElementById("history-list");
        list.innerHTML = "";

        if (history.length === 0) {
            list.innerHTML = "<li>Belum ada riwayat.</li>";
            return;
        }

        history.forEach(item => {
            const li = document.createElement("li");
            li.className = "history-item";
            li.innerHTML = `
                <img src="${item.image || "https://via.placeholder.com/60x80"}" alt="${item.title}">
                <div class="details">
                    <div class="title">${item.title}</div>
                    <div class="episode">Episode ${item.episode}</div>
                    <div class="date">${new Date(item.watchedAt).toLocaleString()}</div>
                </div>
            `;
            list.appendChild(li);
        });
    } catch (err) {
        window.location.href = "/login";
    }
}
