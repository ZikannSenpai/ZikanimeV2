"use client";

import ReactPlayer from "react-player";

interface Props {
    url: string;
    onProgress?: (state: { played: number }) => void;
}

export default function Player({ url, onProgress }: Props) {
    return (
        <div className="aspect-video w-full bg-black rounded-lg overflow-hidden">
            <ReactPlayer
                url={url}
                width="100%"
                height="100%"
                controls
                onProgress={onProgress}
                config={{
                    file: {
                        attributes: {
                            controlsList: "nodownload"
                        }
                    }
                }}
            />
        </div>
    );
}
