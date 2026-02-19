export default function VideoPlayer({ src }) {
    console.log("[VideoPlayer] src", src);
    if (!src) return <div>Video source not available</div>;

    return (
        <div className="video-wrap">
            <video controls src={src} style={{ width: "100%" }} />
        </div>
    );
}
