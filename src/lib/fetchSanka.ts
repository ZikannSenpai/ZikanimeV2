import axios from "axios";

const SANKA_BASE = process.env.NEXT_PUBLIC_API_BASE || "/api/sanka";

export async function sankaGet(path: string, params: any = {}) {
    const url = `${SANKA_BASE}${path}`;
    const res = await axios.get(url, { params });
    return res.data;
}
