import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
}

export async function comparePassword(
    password: string,
    hash: string
): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

export function signJWT(payload: { userId: string; username: string }) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyJWT(token: string): Promise<any> {
    return new Promise(resolve => {
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) resolve(null);
            else resolve(decoded);
        });
    });
}
