import lf from "localforage";

export const store = {
  encryption: {
    privateKey: await lf.getItem("encryption.privateKey"),
  },
};
