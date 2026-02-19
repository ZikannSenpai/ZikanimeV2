import useSWR from "swr";
import Navbar from "../components/Navbar";

const fetcher = u => fetch(u).then(r => r.json());

export default function Profile() {
    const { data } = useSWR("/api/auth/me", fetcher);
    const { data: historyData } = useSWR("/api/history", fetcher);

    return (
        <div className="docs-page">
            <Navbar />
            <main className="container">
                <h1>Profile</h1>
                <pre>{JSON.stringify(data?.user || {}, null, 2)}</pre>
                <h2>Watch history</h2>
                <pre>{JSON.stringify(historyData?.history || [], null, 2)}</pre>
            </main>
        </div>
    );
}
