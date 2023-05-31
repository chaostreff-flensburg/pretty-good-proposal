import lf from "localforage";

export const store = {
  encryption: {
    privateKey: null,
  },
};

(async () => {
  store.encryption.privateKey = await lf.getItem("encryption.privateKey");
})();

export const clearStore = async () => {
  await lf.clear();
};
