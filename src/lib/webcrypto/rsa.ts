import { dec, enc } from "./helpers.ts";
import { base64ToBuff, buffToBase64 } from "./helpers.ts";

export const encrypt = async (data: string, publicKey: CryptoKey) => {
  const encryptedBuff = await crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    publicKey,
    enc.encode(data),
  );
  return buffToBase64(encryptedBuff);
};

export const decrypt = async (cipher: string, privateKey: CryptoKey) => {
  const decryptedBuff = await crypto.subtle.decrypt(
    { name: "RSA-OAEP" },
    privateKey,
    base64ToBuff(cipher),
  );
  return dec.decode(decryptedBuff);
};

export const generateKeypair = () =>
  crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 4096,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-512",
    },
    true,
    ["encrypt", "decrypt"],
  );
