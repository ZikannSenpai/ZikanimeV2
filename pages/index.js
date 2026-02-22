// pages/index.js
import Nav from "../components/Nav";
import jwt from "jsonwebtoken";

function getTokenFromCookieStr(cookieStr) {
    const cookie = cookieStr || "";
    const match = cookie
        .split(";")
        .map(s => s.trim())
        .find(s => s.startsWith("zikanime_token="));
    if (!match) return null;
    return match.split("=")[1];
}

export default function Home({ user, homeData }) {
    return (
        <>
            <Nav username={user?.username} />
            <main className="container">
                <section id="homeSection">
                    <div id="homeContent">
                        <h1>Hai {user?.username}</h1>
                        <p>
                            Last watched{" "}
                            {user?.lastWatched?.title || "Belum nonton"}
                        </p>

                        <div className="anime-grid">
                            {homeData?.data?.map((a, i) => (
                                <div key={i} className="anime-card fade-in">
                                    <img
                                        src={a.poster || "/favicon-32x32.png"}
                                        className="anime-poster"
                                    />
                                    <div className="anime-info">
                                        <div className="anime-title">
                                            {a.title || a.name || "No title"}
                                        </div>
                                        <div
                                            style={{
                                                display: "flex",
                                                gap: 8,
                                                marginTop: 8
                                            }}
                                        >
                                            <a
                                                className="watch-btn"
                                                href={`/anime/${a.id || a.slug || i}`}
                                            >
                                                Watch
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
    console.log("homeData:", homeData);
}

export async function getServerSideProps({ req }) {
    const token = getTokenFromCookieStr(req.headers.cookie || "");
    if (!token) {
        return { redirect: { destination: "/login", permanent: false } };
    }
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        // get user from DB
        const fetchUser = async () => {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_SITE_URL}/api/user/profile`,
                { headers: { cookie: req.headers.cookie || "" } }
            );
            if (!res.ok) return null;
            const j = await res.json();
            return j.user;
        };
        const homeRes = await fetch(
            `${process.env.NEXT_PUBLIC_SITE_URL}/api/anime/home`
        );
        const homeData = await homeRes.json().catch(() => null);
        const user = await fetchUser();
        return { props: { user, homeData } };
    } catch (err) {
        return { redirect: { destination: "/login", permanent: false } };
    }
}
