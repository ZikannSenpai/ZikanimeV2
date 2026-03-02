import NavbarBottom from "../components/NavbarBottom";

export default function Profile() {
    return (
        <div className="min-h-screen pb-32 px-4">
            <h1 className="text-lg">Profil</h1>
            <div className="mt-4 card p-4">
                <div>username: Zikann</div>
                <div>xp: 345</div>
                <div>vip: tidak</div>
            </div>
            <NavbarBottom />
        </div>
    );
}
