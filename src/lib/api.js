import { supabase } from '../supabase'

const crypto = window.crypto;
const publicKeyObj = {
    "alg": "RSA-OAEP-512",
    "e": "AQAB",
    "ext": true,
    "key_ops": [
        "encrypt"
    ],
    "kty": "RSA",
    "n": "mj8K9KCHkKQD47XesKJ2KBmlh7iYLjmZGU1Pvefbp-_TkV-Lm22xnxgQoQp_vlgq9tD8187wytJOvw-1u7RbquI6lgy4Si0-0dduXf8ZYc2823ZN5GNry9axEkXSahaBr-_uARHprDpRNQ3k8A8fLT_NJ1FB_rln3LRGz6DqSXxo0FdNx7YjtIW-mgNU9uxKpu1kaW78Pld-YgPFb-LZSNgNUAg6u9MgkPzqDVYYhyxLbk_7n74hPKuAUKlVa1fhUwEh3t6fg2oSTCtiQMBjoZseTJ045eerQTBC2HsCE2pNu3FszQni1-A1iqZal1uUrp7ykiK4Az2JHwvnbPLeyTXdhZw0hNxa7IhiBlEzev2XcXGg1LjDofyfy-xoe05_YkN3WKAPvCF_DbTo4Rf9N9hjanyZfGOSW3rs69raWCb-qDTnGH3PufkT9o0VD2AKE3K271xrFqBLFMrU71hrdlZo7DUXwpbobBiPityPJMRep2zAoWeMxIdJryDIRMPdirVmEPaXk9xWjEcSjkK07CMPhS8uisJLP1orfSm0AzWsD-g6rlyhFjzGT5tryMDQyI8ZPYiU74DL6vWpD_AVWntCjAiCQF1GOJiVPCgy56YpxpuHWM2rm5CwimQEo4NECuqKJ5h8GIP772ahuzq5XDQUpBViOhCQgNCaE6vsHBs"
}

const parsedPublicKey = async (publicKey) => {
    return await crypto.subtle.importKey(
        "jwk",
        publicKey,
        {
            name: "RSA-OAEP",
            hash: { name: "SHA-512" },
        },
        false,
        ["encrypt"]
    )
}
const encryptProposal = async (proposal) => {
    let enc = new TextEncoder();
    let encoded = enc.encode(proposal);
    const publicKey = await parsedPublicKey(publicKeyObj)
    const encryptBuffer = await crypto.subtle.encrypt(
        { name: "RSA-OAEP" },
        publicKey,
        encoded
    )
    console.log('encryptBuffer', encryptBuffer)
    let enc2 = new TextDecoder();
    console.log('enc.encode(proposal);', enc2.decode(encryptBuffer))
    return encryptBuffer
}
const decryptProposal = async (proposal, privateKey) => {
    let dec = new TextDecoder();
    const undecodedProposal = await crypto.subtle.decrypt(
        { name: "RSA-OAEP" },
        privateKey,
        proposal
    );
    return dec.decode(undecodedProposal);
}

const enc = new TextEncoder();
const dec = new TextDecoder();

const buffToBase64 = (buff) =>
    window.btoa(
        new Uint64Array(buff).reduce(
            (str, byte) => str + String.fromCharCode(byte),
            "",
        ),
    );

const base64ToBuff = (b64) =>
    Uint8Array.from(window.atob(b64), (c) => c.charCodeAt(0));

const encrypt = async (data) => {
    let keyPair = await crypto.subtle.generateKey(
        {
          name: "RSA-OAEP",
          modulusLength: 4096,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: "SHA-512",
        },
        true,
        ["encrypt", "decrypt"],
      );
    try {
        const publicKey = await parsedPublicKey(publicKeyObj)
        const encryptedBuff = await crypto.subtle.encrypt(
            { name: "RSA-OAEP" },
            keyPair.publicKey, // publicKey,
            enc.encode(data),
        );
        return buffToBase64(encryptedBuff);
    } catch (error) { console.error(error) }
};

const decrypt = async (cipher, privateKey) => {
    const decryptedBuff = await crypto.subtle.decrypt(
        { name: "RSA-OAEP" },
        privateKey,
        base64ToBuff(cipher),
    );
    return dec.decode(decryptedBuff);
};

const createProposal = async (proposal) => {
    try {
        console.log('JSON.stringify(proposal)', JSON.stringify(proposal))
        const proposalString = JSON.stringify(proposal)
        const encrypted_proposal = await encrypt(proposalString)
        console.log('encryptProposal', encrypted_proposal)
        /*
        return null
        console.log('encrypted_proposal', encrypted_proposal)
        const { data, error } = await supabase
            .from('proposals')
            .insert({
                this_name: proposal.thesisName,
                encrypted_proposal,
                status: 'created', // TODO: Not filled from frontend?
                track: '2023.winter',
            })
        return data
        */
    } catch (error) { console.error(error) }

}

export {
    encryptProposal,
    decryptProposal,
    createProposal
}