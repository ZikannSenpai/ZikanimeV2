import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import History from "@/lib/models/History";

// GET riwayat user
export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get("token")?.value;
        if (!token)
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );

        const payload = verifyToken(token);
        if (!payload)
            return NextResponse.json(
                { error: "Invalid token" },
                { status: 401 }
            );

        await dbConnect();
        const histories = await History.find({ userId: payload.userId })
            .sort({ watchedAt: -1 })
            .limit(10);
        return NextResponse.json({ histories });
    } catch {
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}

// POST tambah riwayat
export async function POST(req: NextRequest) {
    try {
        const token = req.cookies.get("token")?.value;
        if (!token)
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );

        const payload = verifyToken(token);
        if (!payload)
            return NextResponse.json(
                { error: "Invalid token" },
                { status: 401 }
            );

        const { animeId, animeTitle, episode, image } = await req.json();
        if (!animeId || !animeTitle || !episode) {
            return NextResponse.json(
                { error: "Missing fields" },
                { status: 400 }
            );
        }

        await dbConnect();
        // Hapus duplikat (animeId & episode) lalu simpan yang baru
        await History.deleteMany({ userId: payload.userId, animeId, episode });
        const history = await History.create({
            userId: payload.userId,
            animeId,
            animeTitle,
            episode,
            image
        });

        return NextResponse.json({ history }, { status: 201 });
    } catch {
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
