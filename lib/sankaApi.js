const SANKA_BASE = "https://www.sankavollerei.com/anime";

export async function sankaFetch(path) {
    const url = `${SANKA_BASE}/${path}`.replace(/\/+/g, "/");
    console.log("[sankaFetch] requesting", url);
    try {
        const res = await fetch(url, {
            headers: { Accept: "application/json" }
        });
        console.log("[sankaFetch] response status", res.status);
        const data = await res.json().catch(err => {
            console.error("[sankaFetch] json parse error", err);
            return null;
        });
        console.log(
            "[sankaFetch] data",
            data && (Array.isArray(data) ? `array(${data.length})` : "object")
        );
        return { status: res.status, data };
    } catch (err) {
        console.error("[sankaFetch] fetch error", err);
        return { status: 500, error: err.message };
    }
}
