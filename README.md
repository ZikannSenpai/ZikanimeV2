Zikanime — Full Next.js + TypeScript starter

Project scaffold for a responsive anime streaming site named Zikanime.

Features:

Pixel art / retro UI with dominant black + blue theme.

Login page (email/password) using Supabase Auth (recommended for production).

Stores user profile and "last watched" history in Supabase (via simple API routes).

Uses Sanka Vollerei anime API as the data source: https://www.sankavollerei.com/anime/.

Console.log and error logging in every network/logic function to help debugging.

Simple fade in/out and zoom in/out effects on clickable cards/columns.

Ready to deploy to Vercel.



---

Project structure

zikanime/
├─ package.json
├─ tsconfig.json
├─ next.config.js
├─ public/
│  ├─ favicon.ico
│  └─ pixel-font.woff2
├─ styles/
│  └─ globals.css
├─ lib/
│  ├─ sanka.ts
│  └─ supabaseClient.ts
├─ pages/
│  ├─ _app.tsx
│  ├─ index.tsx
│  ├─ login.tsx
│  ├─ profile.tsx
│  ├─ watch/[id].tsx
│  └─ api/
│     ├─ profile.ts
│     └─ history.ts
└─ components/
   ├─ Header.tsx
   ├─ AnimeCard.tsx
   └─ PixelButton.tsx


---

> IMPORTANT: This is a starter implementation. For production persistence and secure server-side operations, use a hosted database (Supabase, MongoDB Atlas, etc.) — see the deploy instructions at the end.




---

package.json

{
  "name": "zikanime",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "14.0.0",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "@supabase/supabase-js": "2.0.0"
  },
  "devDependencies": {
    "typescript": "5.4.2"
  }
}


---

next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}
module.exports = nextConfig


---

tsconfig.json

{
  "compilerOptions": {
    "target": "es2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "esModuleInterop": true
  },
  "exclude": ["node_modules"],
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"]
}


---

public/favicon.ico

Use any 32x32 pixel-style favicon. (Place your file at public/favicon.ico.)


---

styles/globals.css

@font-face{font-family: 'Pixel'; src: url('/pixel-font.woff2') format('woff2');}
:root{
  --bg: #03030a; /* near black */
  --accent: #00a3ff; /* bright blue */
  --muted: #6b7280;
}
*{box-sizing:border-box}
html,body,#__next{height:100%}
body{
  margin:0;
  font-family: 'Pixel', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
  background: linear-gradient(180deg, var(--bg) 0%, #051022 100%);
  color: #e6f0ff;
}
.container{max-width:1100px;margin:0 auto;padding:24px}
.header{display:flex;align-items:center;gap:12px;padding:12px 0}
.logo{font-weight:700;color:var(--accent);letter-spacing:2px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:18px}
.card{
  background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
  border: 1px solid rgba(0,163,255,0.12);
  padding:12px;border-radius:8px;cursor:pointer;transition:transform .18s ease,opacity .18s ease;overflow:hidden
}
.card:active{transform:scale(.98)}
.card .title{font-size:14px;margin-top:8px;color:#dff3ff}
.card .meta{font-size:12px;color:var(--muted)}
.fade-in{animation:fadeIn .3s ease both}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
.zoom-press{transition:transform .12s ease}
.zoom-press:active{transform:scale(1.06)}

/* pixel borders */
.pixel-border{image-rendering: pixelated;border:3px solid transparent;box-shadow: inset 0 0 0 3px rgba(0,163,255,0.12)}

/* responsive */
@media (max-width:600px){.container{padding:12px}}


---

lib/sanka.ts — Sanka API helper (all functions log responses/errors)

// lib/sanka.ts
export const SANKA_BASE = process.env.NEXT_PUBLIC_SANKA_API || 'https://www.sankavollerei.com/anime';

export async function fetchHome(){
  console.log('[sanka] fetchHome: starting');
  try{
    const res = await fetch(`${SANKA_BASE}`);
    console.log('[sanka] fetchHome: raw response', res);
    const text = await res.text();
    console.log('[sanka] fetchHome: text length', text.length);
    // The Sanka site returns HTML docs; depending on endpoint you might use their JSON endpoints
    // Try the /api endpoints (if available) - we will attempt JSON first
    try{
      const jsonRes = await fetch(`${SANKA_BASE}/home`);
      console.log('[sanka] fetchHome: /home response', jsonRes);
      const json = await jsonRes.json();
      console.log('[sanka] fetchHome: parsed json', json?.slice?.(0,3) || json);
      return json;
    }catch(err){
      console.error('[sanka] fetchHome: /home json parse failed', err);
      return { html: text };
    }
  }catch(err){
    console.error('[sanka] fetchHome: error', err);
    throw err;
  }
}

export async function searchAnime(q:string){
  console.log('[sanka] searchAnime:', q);
  try{
    const url = `${SANKA_BASE}/search?q=${encodeURIComponent(q)}`;
    console.log('[sanka] searchAnime: url', url);
    const res = await fetch(url);
    const json = await res.json();
    console.log('[sanka] searchAnime: result', json?.length ?? 'no-length');
    return json;
  }catch(err){
    console.error('[sanka] searchAnime: error', err);
    return [];
  }
}

export async function getAnimeDetail(id:string){
  console.log('[sanka] getAnimeDetail:', id);
  try{
    const url = `${SANKA_BASE}/anime/${encodeURIComponent(id)}`;
    console.log('[sanka] getAnimeDetail: url', url);
    const res = await fetch(url);
    const json = await res.json();
    console.log('[sanka] getAnimeDetail: got', json?.title || 'no title');
    return json;
  }catch(err){
    console.error('[sanka] getAnimeDetail: error', err);
    throw err;
  }
}

All functions print console logs for debugging. If the endpoints vary, tweak SANKA_BASE or paths.


---

lib/supabaseClient.ts

import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

console.log('[supabase] initializing client', { urlPresent: !!url, keyPresent: !!key });

export const supabase = createClient(url, key);


---

components/AnimeCard.tsx

import React from 'react';

export default function AnimeCard({ data, onClick }:{data:any; onClick?:()=>void}){
  return (
    <div className={`card pixel-border fade-in zoom-press`} onClick={onClick} role="button" tabIndex={0} onKeyDown={(e)=>{if(e.key==='Enter') onClick?.()}}>
      <div style={{height:140,background:'#021226',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <img src={data.thumb || '/favicon.ico'} alt={data.title} style={{maxWidth:'100%',maxHeight:'100%',imageRendering:'pixelated'}}/>
      </div>
      <div className="title">{data.title}</div>
      <div className="meta">{data.type || 'Anime'}</div>
    </div>
  )
}

All components have subtle logging when needed — add console.log in handlers in pages.


---

pages/_app.tsx

import '../styles/globals.css'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps){
  console.log('[app] render', Component?.name);
  return <Component {...pageProps} />
}


---

pages/index.tsx (home — lists anime via Sanka)

import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import { fetchHome } from '../lib/sanka'
import AnimeCard from '../components/AnimeCard'

export default function Home(){
  const [items, setItems] = useState<any[]>([])
  useEffect(()=>{
    async function load(){
      console.log('[home] load start')
      try{
        const res = await fetchHome()
        console.log('[home] load got', res)
        if(Array.isArray(res)) setItems(res)
        else if(res?.data) setItems(res.data)
      }catch(err){
        console.error('[home] load error', err)
      }
    }
    load()
  },[])

  return (
    <div>
      <Head>
        <title>Zikanime</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container">
        <header className="header">
          <div className="logo">Zikanime</div>
          <nav style={{marginLeft:'auto'}}>
            <a href="/login" style={{color:'var(--accent)'}}>Login</a>
          </nav>
        </header>

        <main>
          <h2 style={{color:'var(--accent)'}}>Ongoing / Popular</h2>
          <section className="grid">
            {items.length===0 ? <div>Loading...</div> : items.map((it:any)=> (
              <AnimeCard key={it.id||it.slug||it.title} data={it} onClick={()=>{console.log('[home] clicked', it); window.location.href=`/watch/${it.slug||it.id}`}} />
            ))}
          </section>
        </main>
      </div>
    </div>
  )
}

All click handlers log the clicked item and then navigate.


---

pages/login.tsx (client-side Supabase auth)

import React, { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import Head from 'next/head'

export default function Login(){
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [loading,setLoading] = useState(false)

  async function signUp(){
    setLoading(true)
    console.log('[auth] signUp start', email)
    try{
      const { data, error } = await supabase.auth.signUp({ email, password })
      console.log('[auth] signUp result', { data, error })
      if(error) throw error
      alert('Check your email for confirmation link (if required).')
    }catch(err){
      console.error('[auth] signUp error', err)
      alert('Error: '+(err as any).message)
    }finally{ setLoading(false) }
  }

  async function signIn(){
    setLoading(true)
    console.log('[auth] signIn start', email)
    try{
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      console.log('[auth] signIn result', { data, error })
      if(error) throw error
      window.location.href = '/profile'
    }catch(err){
      console.error('[auth] signIn error', err)
      alert('Error: '+(err as any).message)
    }finally{ setLoading(false) }
  }

  return (
    <div className="container">
      <Head><title>Login - Zikanime</title></Head>
      <h1 style={{color:'var(--accent)'}}>Login</h1>
      <div style={{maxWidth:420}}>
        <input className="pixel-input" placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="pixel-input" placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <div style={{display:'flex',gap:8}}>
          <button onClick={signIn} disabled={loading}>Sign in</button>
          <button onClick={signUp} disabled={loading}>Sign up</button>
        </div>
      </div>
    </div>
  )
}

All auth actions log to console. This client uses Supabase JS; make sure you set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.


---

pages/watch/[id].tsx (watch page — saves last watched via API)

import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import { getAnimeDetail } from '../../lib/sanka'

export default function Watch(){
  const r = useRouter();
  const { id } = r.query
  const [detail,setDetail] = useState<any>(null)

  useEffect(()=>{
    if(!id) return
    async function load(){
      console.log('[watch] load', id)
      try{
        const d = await getAnimeDetail(String(id))
        console.log('[watch] got detail', d)
        setDetail(d)
        // save history to server
        try{
          const res = await fetch('/api/history', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ animeId: id, title: d.title }) })
          console.log('[watch] history save response', res)
        }catch(err){ console.error('[watch] history save failed', err) }
      }catch(err){ console.error('[watch] load failed', err) }
    }
    load()
  },[id])

  return (
    <div className="container">
      <Head><title>Watch</title></Head>
      <h1 style={{color:'var(--accent)'}}>{detail?.title || 'Loading...'}</h1>
      <div style={{background:'#000',padding:12,borderRadius:8}}>
        {/* If the API supplies a streaming url, embed it here; otherwise embed an iframe */}
        <div style={{width:'100%',height:420,background:'#021226',display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{color:'#7fbfff'}}>Player placeholder (embed the streaming src from Sanka API)</div>
        </div>
      </div>
    </div>
  )
}

Every step logs activities and attempts to save watch history.


---

pages/api/history.ts (server API route — stores last watched in Supabase table watch_history)

import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPA_SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

const supa = createClient(SUPA_URL, SUPA_SERVICE)

export default async function handler(req:NextApiRequest,res:NextApiResponse){
  console.log('[api/history] method', req.method)
  if(req.method !== 'POST') return res.status(405).end()
  const { animeId, title } = req.body || {}
  console.log('[api/history] body', { animeId, title })
  try{
    // NOTE: In a real app, get user id from auth cookie/session
    const userId = req.headers['x-user-id'] || 'anonymous'
    const now = new Date().toISOString()
    const { data, error } = await supa.from('watch_history').upsert({ user_id: userId, anime_id: animeId, title, updated_at: now }, { onConflict: ['user_id'] })
    console.log('[api/history] supa result', { data, error })
    if(error) throw error
    res.status(200).json({ ok:true })
  }catch(err){
    console.error('[api/history] error', err)
    res.status(500).json({ error: (err as any).message })
  }
}

Important: SUPABASE_SERVICE_ROLE_KEY must be kept secret and set only on the server (Vercel environment variables). The watch_history table should have columns: user_id (text primary), anime_id (text), title (text), updated_at (timestamp).


---

Profile API (pages/api/profile.ts)

// similar pattern: use Supabase Admin key to read/write profile
import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'
const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPA_SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const supa = createClient(SUPA_URL, SUPA_SERVICE)

export default async function handler(req:NextApiRequest,res:NextApiResponse){
  console.log('[api/profile] method', req.method)
  try{
    const userId = req.headers['x-user-id'] || 'anonymous'
    if(req.method === 'GET'){
      const { data, error } = await supa.from('profiles').select('*').eq('id', userId).single()
      console.log('[api/profile] get', { data, error })
      if(error) return res.status(500).json({ error: error.message })
      return res.json(data)
    }
    if(req.method === 'POST'){
      const payload = req.body
      const { data, error } = await supa.from('profiles').upsert({ id: userId, ...payload })
      console.log('[api/profile] upsert', { data, error })
      if(error) return res.status(500).json({ error: error.message })
      return res.json({ ok:true })
    }
    res.status(405).end()
  }catch(err){
    console.error('[api/profile] error', err)
    res.status(500).json({ error: (err as any).message })
  }
}


---

Database / Supabase setup

1. Create a Supabase project at the Supabase dashboard.


2. Create tables profiles and watch_history:



create table profiles (
  id text primary key,
  display_name text,
  avatar_url text,
  bio text
);

create table watch_history (
  user_id text primary key,
  anime_id text,
  title text,
  updated_at timestamp
);

3. Add Row Level Security rules as needed or use service role key for server side writes.




---

Environment variables (.env.local)

NEXT_PUBLIC_SANKA_API=https://www.sankavollerei.com/anime
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

Be careful: SUPABASE_SERVICE_ROLE_KEY must not be exposed to the browser. Set it only in Vercel's project secrets.


---

Pixel effects: fade in/out and zoom in/out

fade-in CSS class used for entry animations.

zoom-press class (scale on :active) implements quick zoom when pressing columns/cards.

For fade out, add a small onClick handler that toggles a fading class which triggers opacity:0 with transition, then navigates after 180ms. All code handlers log to console before transition.



---

How to run locally

1. git clone <repo>


2. cd zikanime


3. npm install


4. Create .env.local with variables above.


5. npm run dev


6. Open http://localhost:3000




---

Deploy to Vercel (recommended)

1. Push your repo to GitHub/GitLab/Bitbucket.


2. Create a Vercel account and connect your Git provider.


3. Import the project and select the main branch (Vercel auto detects Next.js).


4. In Vercel project settings > Environment Variables, add the keys from .env.local. Make sure SUPABASE_SERVICE_ROLE_KEY is set only to the Production and Preview environments as required and NOT exposed to client-side (do not prefix with NEXT_PUBLIC_).


5. Deploy. Vercel will run npm run build and create a serverless deployment.



> See the Vercel docs for details on Next.js deployment and environment variables.




---

Notes, caveats and next steps

This repo is a starter kit showing how to wire the Sanka API and Supabase. The Sanka endpoints sometimes return HTML — you might need to adapt the parsing depending on which endpoint you use (the helper functions include logs to make that easier).

Storing the SUPABASE_SERVICE_ROLE_KEY in Vercel is secure — do not commit it to your repo.

For real streaming, verify the Sanka API returns playable streams (or use a compatible streaming host) — right now the watch page includes a placeholder where you can embed the streaming URL.

If you prefer not to use Supabase, you can swap the server API routes to your database of choice (MongoDB Atlas, PlanetScale, etc.).



---

License

MIT — use it, modify it, break it, learn from it.

End of project scaffold.