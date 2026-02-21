// public/script.js
async function api(path, opts = {}) {
    const res = await fetch(`/api/${path}`, opts);
    if (!res.ok) throw await res.json();
    return res.json();
}

async function checkAuth() {
    try {
        const j = await api("auth/me");
        return j.user;
    } catch (e) {
        location.href = "/login";
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    await checkAuth();
    // load home
    loadHome();
    // search handling etc
});

async function loadHome() {
    const container = document.getElementById("homeContent");
    document.getElementById("homeLoading").style.display = "flex";
    try {
        const data = await api("anime/home");
        // render grid
        container.innerHTML = renderGrid(data.data || data);
        document.querySelectorAll(".anime-card").forEach(el => {
            el.classList.add("fade-in");
            el.addEventListener("click", () => openVideo(el.dataset.slug));
        });
    } catch (e) {
        container.innerHTML = `<div class="error-message">Gagal load</div>`;
    } finally {
        document.getElementById("homeLoading").style.display = "none";
        container.style.display = "block";
    }
}

function renderGrid(list) {
    if (!list || !list.length) return "<p>Tidak ada data</p>";
    return `<div class="anime-grid">${list
        .map(
            i => `
    <div class="anime-card" data-slug="${i.slug || i.id}">
      <img class="anime-poster" src="${i.poster || i.image}" />
      <div class="anime-info">
        <div class="anime-title">${i.title || i.name}</div>
        <div class="anime-meta">
          <span class="anime-type">${i.type || "Anime"}</span>
          <span class="anime-rating">${i.rating || "-"}</span>
        </div>
        <button class="watch-btn">Tonton</button>
      </div>
    </div>`
        )
        .join("")}</div>`;
}

async function openVideo(slug) {
    // fetch episode list via proxy endpoint e.g. /api/anime/episode/${slug}
    const modal = document.getElementById("videoModal");
    document.getElementById("videoTitle").innerText = "Memuat...";
    modal.style.display = "flex";
    try {
        const j = await api(`anime/detail/${slug}`);
        // isi player iframe atau video tag
        document.getElementById("videoPlayer").innerHTML =
            `<iframe src="${j.data.embed || j.data.stream}" allowfullscreen></iframe>`;
        document.getElementById("videoTitle").innerText =
            j.data.title || j.data.name;
        // simpan history
        await fetch("/api/user/history", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
                animeId: slug,
                title: j.data.title,
                episode: 1,
                poster: j.data.poster
            })
        });
    } catch (e) {
        document.getElementById("videoPlayer").innerHTML =
            `<div class="error-message">Gagal muat</div>`;
    }
}

document.getElementById("closeVideoBtn")?.addEventListener("click", () => {
    document.getElementById("videoModal").style.display = "none";
    document.getElementById("videoPlayer").innerHTML =
        `<div style="display:flex;justify-content:center;align-items:center;height:100%;color:white"><p>Memuat video...</p></div>`;
});
