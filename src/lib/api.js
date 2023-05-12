import { supabase } from "../supabase";
import * as aes from "./webcrypto/aes.js";
import * as rsa from "./webcrypto/rsa.js";
import { randomString } from "./webcrypto/helpers.js";
import { store } from "./store.js";

// encryption

const crypto = window.crypto;

const publicKeyObj = {
  alg: "RSA-OAEP-512",
  e: "AQAB",
  ext: true,
  key_ops: ["encrypt"],
  kty: "RSA",
  n: "mj8K9KCHkKQD47XesKJ2KBmlh7iYLjmZGU1Pvefbp-_TkV-Lm22xnxgQoQp_vlgq9tD8187wytJOvw-1u7RbquI6lgy4Si0-0dduXf8ZYc2823ZN5GNry9axEkXSahaBr-_uARHprDpRNQ3k8A8fLT_NJ1FB_rln3LRGz6DqSXxo0FdNx7YjtIW-mgNU9uxKpu1kaW78Pld-YgPFb-LZSNgNUAg6u9MgkPzqDVYYhyxLbk_7n74hPKuAUKlVa1fhUwEh3t6fg2oSTCtiQMBjoZseTJ045eerQTBC2HsCE2pNu3FszQni1-A1iqZal1uUrp7ykiK4Az2JHwvnbPLeyTXdhZw0hNxa7IhiBlEzev2XcXGg1LjDofyfy-xoe05_YkN3WKAPvCF_DbTo4Rf9N9hjanyZfGOSW3rs69raWCb-qDTnGH3PufkT9o0VD2AKE3K271xrFqBLFMrU71hrdlZo7DUXwpbobBiPityPJMRep2zAoWeMxIdJryDIRMPdirVmEPaXk9xWjEcSjkK07CMPhS8uisJLP1orfSm0AzWsD-g6rlyhFjzGT5tryMDQyI8ZPYiU74DL6vWpD_AVWntCjAiCQF1GOJiVPCgy56YpxpuHWM2rm5CwimQEo4NECuqKJ5h8GIP772ahuzq5XDQUpBViOhCQgNCaE6vsHBs",
};

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

const encryptProposalData = async (proposal) => {
  const symatricKey = randomString(128);
  const encryptedData = await aes.encrypt(
    JSON.stringify(proposal),
    symatricKey
  );
  const encryptedSymatricKey = await rsa.encrypt(
    symatricKey,
    await getPublicKey(publicKeyObj)
  );

  return { encryptedData, encryptedSymatricKey };
};

const decryptProposalData = async (encryptedData, encryptedSymatricKey) => {
  const symatricKey = await rsa.decrypt(
    encryptedSymatricKey,
    await getPrivateKey(store.encryption.privateKey)
  );
  const proposalData = JSON.parse(
    await aes.decrypt(encryptedData, symatricKey)
  );

  return {
    proposalData,
    symatricKey,
  };
};

// supabase api wrapper

const createProposal = async (proposalData) => {
  const { encryptedData, encryptedSymatricKey } = await encryptProposalData(
    proposalData
  );
  await supabase
    .from("proposals")
    .insert({
      thesis_name: proposalData.thesisName,
      encrypted_data: encryptedData,
      encrypted_symatric_key: encryptedSymatricKey,
      status: "created", // TODO: Not filled from frontend?
      track: "2023.winter",
    })
    .throwOnError();
};

const getProposalById = async (id) => {
  const {
    data: [encryptedProposal],
  } = await supabase
    .from("proposals")
    .select(`*, opinions(*,profiles(*))`)
    .eq("id", id)
    .throwOnError();

  const { proposalData } = await decryptProposalData(
    encryptedProposal.encrypted_data,
    encryptedProposal.encrypted_symatric_key
  );
  const proposal = {
    ...encryptedProposal,
    data: proposalData,
  };

  return proposal;
};

export { createProposal, getProposalById };
