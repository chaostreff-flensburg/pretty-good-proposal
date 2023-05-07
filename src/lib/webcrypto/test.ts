import * as rsa from "./rsa.ts";
import * as aes from "./aes.ts";
import { randomString } from "./helpers.ts";
import {
  assert,
  assertEquals,
} from "https://deno.land/std@0.177.0/testing/asserts.ts";

Deno.test("rsa and aes", async () => {
  // should happen beforehand
  const keypair = await rsa.generateKeypair();
  assert(keypair);

  // on the client (encrypt)
  const password = randomString(16);
  const data = randomString(5000);

  const encrypted = await aes.encrypt(data, password);
  assert(encrypted);

  const encryptedPassword = await rsa.encrypt(password, keypair.publicKey);
  assert(encryptedPassword);

  // decrypt
  const decryptedPassword = await rsa.decrypt(
    encryptedPassword,
    keypair.privateKey,
  );
  assert(decryptedPassword);

  const decrypted = await aes.decrypt(encrypted, decryptedPassword);
  assertEquals(decrypted, data);
});
