const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET || "dev_jwt_secret";

function sign(user) {
    console.log("[jwt] signing user", user?.email || user?.id);
    return jwt.sign({ id: user.id, email: user.email }, SECRET, {
        expiresIn: "7d"
    });
}
function verify(token) {
    try {
        const data = jwt.verify(token, SECRET);
        console.log("[jwt] verify ok", data);
        return data;
    } catch (err) {
        console.error("[jwt] verify error", err.message);
        return null;
    }
}
module.exports = { sign, verify };
