import React from "react";

export default function AnimeCard({
    data,
    onClick
}: {
    data: any;
    onClick?: () => void;
}) {
    return (
        <div
            className={`card pixel-border fade-in zoom-press`}
            onClick={onClick}
            role="button"
            tabIndex={0}
            onKeyDown={e => {
                if (e.key === "Enter") onClick?.();
            }}
        >
            <div
                style={{
                    height: 140,
                    background: "#021226",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >
                <img
                    src={data.thumb || "/favicon.ico"}
                    alt={data.title}
                    style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        imageRendering: "pixelated"
                    }}
                />
            </div>
            <div className="title">{data.title}</div>
            <div className="meta">{data.type || "Anime"}</div>
        </div>
    );
}
