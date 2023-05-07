export const enc = new TextEncoder();
export const dec = new TextDecoder();

export const buffToBase64 = (buff: ArrayBuffer): string =>
  btoa(
    new Uint8Array(buff).reduce(
      (str, byte) => str + String.fromCharCode(byte),
      "",
    ),
  );

export const base64ToBuff = (b64: string): ArrayBuffer =>
  Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));

export const randomString = (length: number) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};
