import NavbarBottom from "../components/NavbarBottom";

export default function Event() {
    return (
        <div className="min-h-screen pb-32 px-4">
            <h1 className="text-lg">Event</h1>
            <div className="mt-4 space-y-3">
                <div className="card p-4">Sign-in harian • Dapet XP boost</div>
                <div className="card p-4">Event harian nonton dapat XP</div>
            </div>
            <NavbarBottom />
        </div>
    );
}
