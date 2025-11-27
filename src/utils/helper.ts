import CryptoJS from "crypto-js";

export function encrypt(text: string): string {
  const secretKey = import.meta.env.VITE_CRYPTO_SECRET_KEY;

  if (!secretKey) {
    throw new Error(
      "CRYPTO_SECRET_KEY is not defined in environment variables"
    );
  }

  const hashedText = CryptoJS.AES.encrypt(text, secretKey).toString()

  console.log("Hashed Text: ", hashedText)

  return hashedText;
}

export function decrypt(cipherText: string): string {
  const secretKey = import.meta.env.VITE_CRYPTO_SECRET_KEY;

  if (!secretKey) {
    throw new Error(
      "CRYPTO_SECRET_KEY is not defined in environment variables"
    );
  }

  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);

    if (!decryptedText) {
      throw new Error("Decryption failed - invalid ciphertext or key");
    }

    return decryptedText;
  } catch {
    throw new Error("Failed to decrypt data");
  }
}