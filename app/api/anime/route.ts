import { NextResponse } from "next/server";
import { fetchAnimeList } from "@/lib/api";

export async function GET() {
    try {
        const data = await fetchAnimeList();
        return NextResponse.json(data);
    } catch {
        return NextResponse.json(
            { error: "Failed to fetch anime" },
            { status: 500 }
        );
    }
}
