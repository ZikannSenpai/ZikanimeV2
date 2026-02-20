let currentUser = null;
let currentPage = "home";
let currentPageNum = 1;
let currentKeyword = "";
let currentSlug = ""; // untuk genre/season

const contentArea = document.getElementById("contentArea");
const pageTitle = document.getElementById("pageTitle");
const userSection = document.getElementById("userSection");
const loginModal = document.getElementById("loginModal");
const episodeModal = document.getElementById("episodeModal");
const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

// Utility
function showError(consoleMsg, userMsg) {
    console.error(consoleMsg);
    if (userMsg)
        contentArea.innerHTML = `<div class="error-message">${userMsg}</div>`;
}

async function apiCall(url, options = {}) {
    try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error(`API Call Error (${url}):`, error);
        throw error;
    }
}

// Session
async function checkSession() {
    try {
        const data = await apiCall("/api/me");
        if (data.loggedIn) {
            currentUser = data.user;
            updateUserSection();
        }
    } catch (error) {
        showError("Session check failed:", "Gagal memeriksa session");
    }
}

function updateUserSection() {
    if (currentUser) {
        userSection.innerHTML = `
            <div class="user-info">
                <span>Halo, ${currentUser.username}</span>
                <button class="btn-logout" onclick="logout()">Logout</button>
            </div>
        `;
    } else {
        userSection.innerHTML = `
            <div class="user-info">
                <span>Belum login</span>
                <button class="btn-login" onclick="showLoginModal()">Login</button>
            </div>
        `;
    }
}

function showLoginModal() {
    loginModal.style.display = "block";
    loginError.textContent = "";
}

async function logout() {
    try {
        await apiCall("/api/logout", { method: "POST" });
        currentUser = null;
        updateUserSection();
        loadPage(currentPage);
    } catch (error) {
        showError("Logout error:", "Gagal logout");
    }
}

// Login form
loginForm.addEventListener("submit", async e => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const isLogin = e.submitter.id === "loginBtn";

    try {
        const endpoint = isLogin ? "/api/login" : "/api/register";
        const data = await apiCall(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        if (data.success) {
            currentUser = data.user;
            updateUserSection();
            loginModal.style.display = "none";
            loadPage(currentPage);
        }
    } catch (error) {
        loginError.textContent = "Login gagal, coba lagi";
        showError("Login error:", error);
    }
});

// Navigasi
document.querySelectorAll(".nav-menu a").forEach(link => {
    link.addEventListener("click", e => {
        e.preventDefault();
        const page = link.dataset.page;
        currentPage = page;
        currentPageNum = 1;
        currentKeyword = "";
        searchInput.value = "";
        pageTitle.textContent = link.querySelector("span").textContent;
        loadPage(page);
    });
});

// Search
searchBtn.addEventListener("click", () => {
    const keyword = searchInput.value.trim();
    if (keyword) {
        currentPage = "search";
        currentKeyword = keyword;
        currentPageNum = 1;
        pageTitle.textContent = `Pencarian: ${keyword}`;
        loadPage("search");
    }
});

searchInput.addEventListener("keypress", e => {
    if (e.key === "Enter") searchBtn.click();
});

// Load halaman
async function loadPage(page) {
    contentArea.innerHTML = '<div class="loading">Memuat...</div>';

    try {
        let data;
        switch (page) {
            case "home":
                data = await apiCall("/api/anime/home");
                displayAnimeGrid(data);
                break;
            case "ongoing":
                data = await apiCall(
                    `/api/anime/quick/ongoing?page=${currentPageNum}`
                );
                displayAnimeGrid(data, true);
                break;
            case "finished":
                data = await apiCall(
                    `/api/anime/quick/finished?page=${currentPageNum}`
                );
                displayAnimeGrid(data, true);
                break;
            case "movie":
                data = await apiCall(
                    `/api/anime/quick/movie?page=${currentPageNum}`
                );
                displayAnimeGrid(data, true);
                break;
            case "donghua":
                data = await apiCall(
                    `/api/anime/quick/donghua?page=${currentPageNum}`
                );
                displayAnimeGrid(data, true);
                break;
            case "popular":
                data = await apiCall(
                    `/api/anime/quick/popular?page=${currentPageNum}`
                );
                displayAnimeGrid(data, true);
                break;
            case "genre":
                loadGenreList();
                break;
            case "season":
                loadSeasonList();
                break;
            case "history":
                loadHistory();
                break;
            case "search":
                if (currentKeyword) {
                    data = await apiCall(
                        `/api/anime/search/${encodeURIComponent(currentKeyword)}`
                    );
                    displayAnimeGrid(data);
                }
                break;
            case "genre-detail":
                if (currentKeyword) {
                    data = await apiCall(
                        `/api/anime/properties/genre/${currentKeyword}`
                    );
                    displayAnimeGrid(data, true);
                }
                break;
            case "season-detail":
                if (currentKeyword) {
                    data = await apiCall(
                        `/api/anime/properties/season/${currentKeyword}`
                    );
                    displayAnimeGrid(data, true);
                }
                break;
            default:
                contentArea.innerHTML = "<div>Halaman tidak ditemukan</div>";
        }
    } catch (error) {
        showError(`Error loading page ${page}:`, "Gagal memuat data");
        contentArea.innerHTML =
            '<div class="error-message">Gagal memuat data. Coba lagi nanti.</div>';
    }
}

function displayAnimeGrid(animeList, hasPagination = false) {
    if (!animeList || animeList.length === 0) {
        contentArea.innerHTML =
            '<div class="error-message">Tidak ada anime ditemukan</div>';
        return;
    }

    let html = '<div class="anime-grid">';
    animeList.forEach(anime => {
        const id = anime.id || anime.href?.split("/").pop() || "";
        const slug = anime.slug || id;
        const poster =
            anime.poster || anime.thumbnail || anime.image || "/default.jpg";
        html += `
            <div class="anime-card" onclick="showAnimeDetail('${id}', '${slug}')">
                <img src="${poster}" alt="${anime.title}" loading="lazy" onerror="this.src='/default.jpg'">
                <div class="anime-info">
                    <h3>${anime.title}</h3>
                    <p>${anime.episode || anime.type || anime.score || ""}</p>
                </div>
            </div>
        `;
    });
    html += "</div>";

    if (hasPagination) {
        html += `
            <div class="pagination" style="margin-top:20px; text-align:center">
                <button onclick="changePage(-1)" ${currentPageNum <= 1 ? "disabled" : ""}>Prev</button>
                <span> Halaman ${currentPageNum} </span>
                <button onclick="changePage(1)" ${animeList.length < 20 ? "disabled" : ""}>Next</button>
            </div>
        `;
    }

    contentArea.innerHTML = html;
}

function changePage(delta) {
    currentPageNum += delta;
    loadPage(currentPage);
}

async function loadGenreList() {
    try {
        const genres = await apiCall("/api/anime/properties/genre");
        let html =
            '<div class="genre-grid" style="display:grid; grid-template-columns:repeat(auto-fill,minmax(150px,1fr)); gap:10px;">';
        genres.forEach(genre => {
            html += `
                <div class="genre-item" onclick="loadGenre('${genre.slug}')" style="background:#1a1a2e; padding:10px; border-radius:4px; cursor:pointer; text-align:center">
                    ${genre.name} (${genre.count || 0})
                </div>
            `;
        });
        html += "</div>";
        contentArea.innerHTML = html;
    } catch (error) {
        showError("Error loading genres:", "Gagal memuat genre");
    }
}

async function loadSeasonList() {
    try {
        const seasons = await apiCall("/api/anime/properties/season");
        let html =
            '<div class="season-grid" style="display:grid; grid-template-columns:repeat(auto-fill,minmax(150px,1fr)); gap:10px;">';
        seasons.forEach(season => {
            html += `
                <div class="season-item" onclick="loadSeason('${season.slug}')" style="background:#1a1a2e; padding:10px; border-radius:4px; cursor:pointer; text-align:center">
                    ${season.name}
                </div>
            `;
        });
        html += "</div>";
        contentArea.innerHTML = html;
    } catch (error) {
        showError("Error loading seasons:", "Gagal memuat season");
    }
}

function loadGenre(slug) {
    currentPage = "genre-detail";
    currentKeyword = slug;
    pageTitle.textContent = `Genre: ${slug}`;
    currentPageNum = 1;
    loadPage("genre-detail");
}

function loadSeason(slug) {
    currentPage = "season-detail";
    currentKeyword = slug;
    pageTitle.textContent = `Season: ${slug}`;
    currentPageNum = 1;
    loadPage("season-detail");
}

async function loadHistory() {
    if (!currentUser) {
        contentArea.innerHTML =
            '<div class="error-message">Silakan login untuk melihat riwayat</div>';
        return;
    }

    try {
        const history = await apiCall("/api/history");
        if (history.length === 0) {
            contentArea.innerHTML = "<div>Belum ada riwayat tontonan</div>";
            return;
        }

        let html = '<div class="history-grid" style="display:grid; gap:15px;">';
        history.forEach(item => {
            html += `
                <div class="history-card" onclick="resumeWatching('${item.animeId}', '${item.slug}', '${item.episode}')" style="display:flex; gap:15px; background:#111; padding:10px; border-radius:8px; cursor:pointer">
                    <img src="${item.image || "/default.jpg"}" style="width:80px; height:100px; object-fit:cover; border-radius:4px;">
                    <div>
                        <h4>${item.title}</h4>
                        <p>Episode ${item.episode}</p>
                        <small>${new Date(item.timestamp).toLocaleString()}</small>
                    </div>
                </div>
            `;
        });
        html += "</div>";
        contentArea.innerHTML = html;
    } catch (error) {
        showError("Error loading history:", "Gagal memuat riwayat");
    }
}

async function showAnimeDetail(id, slug) {
    try {
        const detail = await apiCall(`/api/anime/anime/${id}/${slug}`);
        let episodeHtml = '<div class="episode-list">';
        if (detail.episode_lists && detail.episode_lists.length > 0) {
            detail.episode_lists.forEach(ep => {
                episodeHtml += `
                    <div class="episode-item" onclick="playEpisode('${id}', '${slug}', '${ep.episode}')">
                        Episode ${ep.episode}
                    </div>
                `;
            });
        } else {
            episodeHtml += "<div>Tidak ada episode</div>";
        }
        episodeHtml += "</div>";

        document.getElementById("episodeContent").innerHTML = `
            <h2>${detail.title}</h2>
            <img src="${detail.poster}" alt="${detail.title}" style="max-width:200px; border-radius:8px; margin:10px 0;">
            <p>${detail.synopsis || "Tidak ada sinopsis"}</p>
            <h3>Daftar Episode</h3>
            ${episodeHtml}
        `;
        episodeModal.style.display = "block";
    } catch (error) {
        showError("Error showing detail:", "Gagal memuat detail anime");
    }
}

async function playEpisode(id, slug, episode) {
    episodeModal.style.display = "none";
    try {
        const watch = await apiCall(
            `/api/anime/watch/${id}/${slug}/${episode}`
        );

        if (currentUser) {
            const title =
                document.querySelector("#episodeContent h2")?.textContent ||
                "Unknown";
            const image =
                document.querySelector("#episodeContent img")?.src || "";
            await fetch("/api/history", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    animeId: id,
                    slug,
                    title,
                    episode,
                    image
                })
            }).catch(e => console.error("Gagal simpan history:", e));
        }

        if (watch.stream && watch.stream.length > 0) {
            const streamUrl = watch.stream[0].url;
            contentArea.innerHTML = `
                <div class="player-container">
                    <video controls autoplay style="width:100%; max-height:70vh;" src="${streamUrl}"></video>
                    <h3 style="margin-top:15px;">${document.querySelector("#episodeContent h2")?.textContent || "Anime"} - Episode ${episode}</h3>
                </div>
            `;
        } else {
            alert("Link streaming tidak tersedia");
        }
    } catch (error) {
        showError("Error playing episode:", "Gagal memuat episode");
    }
}

function resumeWatching(animeId, slug, episode) {
    showAnimeDetail(animeId, slug);
}

// Modal close
document.querySelectorAll(".close").forEach(btn => {
    btn.addEventListener("click", () => {
        loginModal.style.display = "none";
        episodeModal.style.display = "none";
    });
});

window.addEventListener("click", e => {
    if (e.target === loginModal) loginModal.style.display = "none";
    if (e.target === episodeModal) episodeModal.style.display = "none";
});

// Initial load
checkSession();
loadPage("home");
