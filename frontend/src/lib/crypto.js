import * as aes from "./webcrypto/aes.js";
import * as rsa from "./webcrypto/rsa.js";
import { randomString } from "./webcrypto/helpers.js";
import lf from "localforage";

const crypto = window.crypto;

const publicKeyObj = {
  "alg": "RSA-OAEP-512",
  "e": "AQAB",
  "ext": true,
  "key_ops": [
    "encrypt"
  ],
  "kty": "RSA",
  "n": "stJgv4gmdnJcFPEOvORztXW4phsordxX3V6csV2_wxwy8mT5tJdItdduCfbiH1lnGCrOD_qBpMmwhXOkHsn-bHqC0ps6eEmyNU7sDpNOdu88KFNlkKI6KxJSOaaFssyfw9_G46Upa_N_z8-BO_OR6VfQv8RDMBPmCdOCFKKWtYS6TTsoTccQDQAFUt6pc2Dfq4RPAThcDWI1sF-3AGYl1_ofHCoCIIBwtaCL09nykafvloGXaaOSdMsuh07wx0WpfXM4WclruYV3p1BvHiXTGCqxI_jflxJEd3CYrMwt-v_MQlr0UDoiDjEvyhdZMDmgBzgtsyTIlQpxpqgy--fyzGCk_7stHVSjyb1js0oEZouiR3dAqfA9-NDedLyxU26Km74DwqQITFSl8RtvvDQdYm5uQ8ncDRWwJdo_exBlHedlwBU6HcE7SBjUD2gdlW2nhBpIg3gkxE-lC8_SLIu_EWobkN1vBIeKh_3bepM2vUbQy-k0a_X2xx9JHPK3hOMQnqbiVRLmaEm--YozwjOjg1XoHokEFwCCqaf69NX8T-a-LDoSh1OHQvNw7HmsuTqH0bIScEZFtvZV8OLZ6z5CMqMkPAmC3Bih-8ToRQH_xFhYp0jJp8kgu2lk085QMPCYhH4fLb6WJF2cFDYNFnhUE1Qgz1pS4O7VOSRB3-6fIZU"
}



const getPublicKey = async (publicKey) =>
  await crypto.subtle.importKey(
    "jwk",
    publicKey,
    {
      name: "RSA-OAEP",
      hash: { name: "SHA-512" },
    },
    false,
    ["encrypt"]
  );

const generateKeypair = async () => {
  const { privateKey, publicKey } = await rsa.generateKeypair()
  const exportPrivateKey = await crypto.subtle.exportKey(
    "jwk",
    privateKey,
    {
      name: "RSA-OAEP",
      hash: { name: "SHA-512" },
    },
    false,
    ["decrypt"]
  );
  const exportPublicKey = await crypto.subtle.exportKey(
    "jwk",
    publicKey,
    {
      name: "RSA-OAEP",
      hash: { name: "SHA-512" },
    },
    false,
    ["encrypt"]
  );
  return { exportPrivateKey, exportPublicKey }
}

const getPrivateKey = async (privateKey) =>
  await crypto.subtle.importKey(
    "jwk",
    privateKey,
    {
      name: "RSA-OAEP",
      hash: { name: "SHA-512" },
    },
    false,
    ["decrypt"]
  );

const encryptProposalData = async (proposal, publicKeyObj) => {
  const symatricKey = randomString(128);
  const encryptedData = await aes.encrypt(
    JSON.stringify(proposal),
    symatricKey
  );
  console.log('encryptedData', encryptedData)
  console.log('getPublicKey(publicKeyObj)', getPublicKey(publicKeyObj))
  const encryptedSymatricKey = await rsa.encrypt(
    symatricKey,
    await getPublicKey(publicKeyObj)
  );

  return { encryptedData, encryptedSymatricKey };
};

const decryptProposalData = async (encryptedData, encryptedSymatricKey) => {
  const symatricKey = await rsa.decrypt(
    encryptedSymatricKey,
    await getPrivateKey(await await lf.getItem("encryption.privateKey"))
  );
  const proposalData = JSON.parse(
    await aes.decrypt(encryptedData, symatricKey)
  );

  return {
    proposalData,
    symatricKey,
  };
};

export {
  getPrivateKey,
  getPublicKey,
  encryptProposalData,
  decryptProposalData,
  generateKeypair
};
