import jwt, { JwtPayload } from 'jsonwebtoken';


interface UserPayload {
    [key: string]: any; // This allows any number of additional properties of any type
}

const secretKey = 'ERPSSecretKey';
const expiresIn = '2h';

function generateToken(payload: UserPayload): string {
    return jwt.sign(payload, secretKey, { expiresIn });
}

function verifyToken(token: string): JwtPayload | null {
    try {
        return jwt.verify(token, secretKey) as JwtPayload;
    } catch (error: any) {
        console.error("Verification error:", error.message);
        return null;
    }
}

export { generateToken, verifyToken };