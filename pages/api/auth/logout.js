// pages/api/auth/logout.js
import { serialize } from "cookie";
export default function handler(req, res) {
    res.setHeader(
        "Set-Cookie",
        serialize("zikanime_token", "", {
            httpOnly: true,
            path: "/",
            expires: new Date(0),
            sameSite: "lax"
        })
    );
    res.json({ success: true });
}
