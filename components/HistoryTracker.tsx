"use client";

import { useEffect } from "react";

interface Props {
    animeId: string;
    animeTitle: string;
    episode: number;
    image?: string;
}

export default function HistoryTracker({
    animeId,
    animeTitle,
    episode,
    image
}: Props) {
    useEffect(() => {
        // Catat ke server saat komponen dimuat (user menonton episode)
        fetch("/api/history", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ animeId, animeTitle, episode, image })
        }).catch(console.error);
    }, [animeId, episode, animeTitle, image]);

    return null; // komponen tidak merender apapun
}
