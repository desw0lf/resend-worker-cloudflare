function str2ab(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

function ab2str(buf: Uint8Array): string {
  return new TextDecoder().decode(buf);
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const byteArray = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < byteArray.byteLength; i++) {
    binary += String.fromCharCode(byteArray[i]);
  }
  return btoa(binary); // Convert binary string to base64
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

async function deriveKey(salt: string): Promise<CryptoKey> {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    str2ab(salt),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: str2ab(salt),
      iterations: 100000,
      hash: "SHA-256"
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

async function encrypt(str: string, salt: string): Promise<string> {
  const key = await deriveKey(salt);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = str2ab(str);

  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv },
    key,
    encoded
  );

  const result = new Uint8Array(iv.length + ciphertext.byteLength);
  result.set(iv);
  result.set(new Uint8Array(ciphertext), iv.length);

  // Convert the result to base64
  return arrayBufferToBase64(result.buffer);
}

async function decrypt(encryptedStr: string, salt: string): Promise<string> {
  const key = await deriveKey(salt);
  const encryptedData = new Uint8Array(base64ToArrayBuffer(encryptedStr));
  const iv = encryptedData.slice(0, 12);
  const ciphertext = encryptedData.slice(12);

  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: iv },
    key,
    ciphertext
  );

  return ab2str(new Uint8Array(decrypted));
}

export default {
  encrypt,
  decrypt
};
