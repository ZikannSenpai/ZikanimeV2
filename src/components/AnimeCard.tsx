import Image from "next/image";

export default function AnimeCard({ title, poster, onClick }: any) {
    return (
        <div className="card p-2 fade-zoom cursor-pointer" onClick={onClick}>
            <div className="relative h-44 w-full rounded overflow-hidden">
                {poster && (
                    <Image
                        src={poster}
                        alt={title}
                        fill
                        sizes="(max-width: 768px) 100vw"
                        style={{ objectFit: "cover" }}
                    />
                )}
            </div>
            <div className="mt-2 text-sm">{title}</div>
        </div>
    );
}
