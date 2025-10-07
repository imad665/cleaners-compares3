import crypto from "crypto";

const ALGORITHM = "aes-256-cbc";
const IV_LENGTH = 16; // AES block size

// Use your NEXTAUTH_SECRET as the encryption key
const SECRET_KEY = crypto
    .createHash("sha256")
    .update(process.env.NEXTAUTH_SECRET || "")
    .digest("base64")
    .substring(0, 32);

/**
 * Encrypts a given text using AES-256-CBC and the NEXTAUTH_SECRET
 */
export function encryptPassword(password: string): string {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(SECRET_KEY), iv);
    let encrypted = cipher.update(password, "utf8", "hex");
    encrypted += cipher.final("hex");
    return `${iv.toString("hex")}:${encrypted}`;
}

/**
 * Decrypts a previously encrypted password using the NEXTAUTH_SECRET
 */
export function decryptPassword(encryptedPassword: string): string {
    try {
        const [ivHex, encrypted] = encryptedPassword.split(":");
        const iv = Buffer.from(ivHex, "hex");
        const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(SECRET_KEY), iv);
        let decrypted = decipher.update(encrypted, "hex", "utf8");
        decrypted += decipher.final("utf8");
        return decrypted;
    } catch (err) {
        return ''
    }


}
