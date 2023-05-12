import lf from "localforage";

export const store = {
  encryption: {
    privateKey: await lf.getItem("encryption.privateKey"),
  },
};

if (!store.encryption.privateKey) {
  const privateKey = JSON.parse(prompt("please insert private key")); // TODO: should be popup or something, parse to enforce valid json
  lf.setItem("encryption.privateKey", privateKey);
  store.encryption.privateKey = privateKey;
}
