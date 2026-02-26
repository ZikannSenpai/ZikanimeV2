"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface Props {
    id: string;
    title: string;
    image: string;
    episode?: number;
}

export default function AnimeCard({ id, title, image, episode }: Props) {
    const [isZoomed, setIsZoomed] = useState(false);

    return (
        <Link href={`/anime/${id}`}>
            <div
                className={`relative bg-darker rounded-xl overflow-hidden shadow-lg border border-primary/20 transform transition-all duration-300 hover:scale-105 hover:border-primary/60 ${
                    isZoomed ? "scale-110 opacity-90" : ""
                }`}
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
                onClick={() => setIsZoomed(true)}
            >
                <div className="relative w-full h-48">
                    <Image
                        src={image || "/placeholder.jpg"}
                        alt={title}
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="p-3">
                    <h3 className="font-semibold text-lg truncate">{title}</h3>
                    {episode && (
                        <p className="text-sm text-primary">
                            Episode {episode}
                        </p>
                    )}
                </div>
                {isZoomed && (
                    <div className="absolute inset-0 bg-primary/10 transition-all duration-300" />
                )}
            </div>
        </Link>
    );
}
