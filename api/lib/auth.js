const jwt = require("jsonwebtoken");

function verifyToken(req) {
    const token =
        req.cookies?.token || req.headers.authorization?.split(" ")[1];
    if (!token) return null;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Token valid untuk user:", decoded.username);
        return decoded;
    } catch (err) {
        console.error("Token tidak valid:", err.message);
        return null;
    }
}

module.exports = { verifyToken };
