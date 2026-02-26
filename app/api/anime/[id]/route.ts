import { NextRequest, NextResponse } from "next/server";
import { fetchAnimeDetail } from "@/lib/api";

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const data = await fetchAnimeDetail(params.id);
        return NextResponse.json(data);
    } catch {
        return NextResponse.json(
            { error: "Failed to fetch anime detail" },
            { status: 500 }
        );
    }
}
