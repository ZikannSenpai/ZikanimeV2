# Zikanime

Zikanime adalah web streaming anime responsif berbasis Next.js dengan backend terintegrasi, sistem login user, penyimpanan riwayat tontonan, dan proxy API ke Sankavollerei. Project ini dirancang sebagai fondasi untuk platform streaming anime skala besar.

## ✨ Fitur

- 🔐 Login & autentikasi user (Supabase Auth)
- 👤 Penyimpanan profil user
- 📺 Riwayat tontonan anime
- 🔁 Proxy API ke Sankavollerei (dengan logging & cache)
- 🎨 UI responsif tema hitam + biru
- ✨ Animasi fade & zoom interaktif
- ⚡ Siap deploy ke Vercel
- 🧱 Arsitektur scalable untuk pengembangan jangka panjang

---

## 🛠️ Tech Stack

- **Frontend & Backend:** Next.js + TypeScript
- **Database & Auth:** Supabase (PostgreSQL)
- **Styling:** Tailwind CSS
- **Deployment:** Vercel
- **API Source:** Sankavollerei Anime API

---

## 📁 Struktur Project
zikanime/ ├─ public/ │  └─ favicon.ico ├─ src/ │  ├─ lib/ │  │  └─ supabase.ts │  ├─ pages/ │  │  ├─ index.tsx │  │  ├─ login.tsx │  │  └─ api/ │  │     ├─ zikanime/[...path].ts │  │     └─ history.ts │  └─ styles/globals.css
Salin kode

---

## 🚀 Instalasi

Clone repository:

```bash
git clone https://github.com/USERNAME/zikanime.git
cd zikanime
Install dependencies:
Salin kode
Bash
npm install
Jalankan development server:
Salin kode
Bash
npm run dev
Buka di browser:
Salin kode

http://localhost:3000
🗄️ Setup Database (Supabase)
Buat project baru di Supabase
Buka SQL Editor
Jalankan query berikut:
Salin kode
Sql
create table watch_history (
  id bigint generated always as identity primary key,
  user_id uuid,
  slug text,
  title text,
  created_at timestamptz default now()
);
🔑 Environment Variables
Buat file .env.local di root project:
Salin kode

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
🌐 API Proxy
Semua request anime melewati proxy internal:
Salin kode

/api/zikanime/anime/home
/api/zikanime/anime/search?q=...
Proxy ini menyediakan:
Logging request & error
Caching sederhana
Kontrol rate limit
Keamanan backend
🚀 Deploy ke Vercel
Push project ke GitHub
Import repository ke Vercel
Tambahkan environment variables di dashboard Vercel
Klik deploy
Vercel akan otomatis build dan publish aplikasi.
🔮 Roadmap Pengembangan
Redis caching
Progressive Web App (PWA)
Sistem rekomendasi anime
Analytics user
Resume episode playback
CDN optimization
Monetisasi & subscription system
⚠️ Catatan Legal
Pastikan penggunaan API dan sumber streaming sesuai dengan izin dan lisensi yang berlaku.
📜 Lisensi
Project ini dibuat untuk tujuan pengembangan dan pembelajaran. Gunakan sesuai hukum yang berlaku.
👨‍💻 Kontributor
Dikembangkan oleh tim Zikanime.