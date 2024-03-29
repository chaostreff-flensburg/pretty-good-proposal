import { fromProposal } from "./structs.js";
import { decryptProposalData } from "./crypto.js";
import { ref } from 'vue';

import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL ? import.meta.env.VITE_BACKEND_URL : 'http://127.0.0.1:8000/api/',
  timeout: 15000
});

const user = ref(null)

const isLoggedIn = () => {
  return !!user.value;
}

const setLogin = (paramUser, token = null) => {
  if (!token) {
    const localStorageAuth = JSON.parse(localStorage.getItem("auth"))
    token = localStorageAuth.token
  }
  client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  user.value = paramUser;

  localStorage.setItem("auth", JSON.stringify({
    token,
    user: paramUser
  })
  );
}
const setLogout = (paramUser, token = null) => {
  localStorage.removeItem("auth")
  user.value = null
}

const language = ref('en')
const browserLanguage = navigator.language || navigator.userLanguage;
if (browserLanguage.includes('de')) {
  language.value = 'de'
}

const i18n = (value) => {
  if (value[language.value]) {
    return value[language.value]
  }
  else if (value['en']) {
    return value[language.value]
  }
  else {
    return 'i18n error'
  }
}

const createProposal = async (name, encryptedData, encryptedSymatricKey, trackSlug) => {
  const reponse = await client.post('proposals', {
    slug: trackSlug,
    name,
    encrypted_data: encryptedData,
    encrypted_symatric_key: encryptedSymatricKey
  })
  return reponse.data.id
};

const getProposalById = async (id) => {
  const response = await client.get(`proposal/${id}`)
  const proposal = response.data

  const { proposalData } = await decryptProposalData(
    proposal.encrypted_data,
    proposal.encrypted_symatric_key
  );

  return fromProposal({
    ...proposal,
    data: proposalData,
  });
};

export { createProposal, getProposalById, client, user, isLoggedIn, setLogin, setLogout, i18n };
