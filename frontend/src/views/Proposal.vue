<script setup>
import { ref } from "vue";
import { createProposal } from "../lib/api";
import { getPublicKey, generateKeypair, encryptProposalData } from "../lib/crypto";
import AllProposals from "../components/AllProposals.vue";
import SaveProposalDialog from "../components/SaveProposalDialog.vue";
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import Textarea from "primevue/textarea";
import Button from "primevue/button";
import Checkbox from "primevue/checkbox";
import Card from 'primevue/card';
import ProgressSpinner from "primevue/progressspinner";
import Message from 'primevue/message';
import Dialog from 'primevue/dialog';
import { useRoute } from 'vue-router'
import { proposals } from '../proposals/index.js'
import dayjs from "dayjs";
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(timezone)
dayjs.tz.setDefault("Berlin/Eruope")


import { client, i18n } from "../lib/api";


const route = useRoute()
const showProposal = ref(false)
const proposalData = ref(null)

const proposal = ref({
  approval: false,
});
if (route.query?.proposal || proposals[route.query.proposal]) {
  proposalData.value = proposals[route.query.proposal]
  if (proposalData.value.deadline && proposalData.value.deadline < dayjs().unix()) {
    showProposal.value = false
  } else {
    showProposal.value = true
    proposalData.value.fields.forEach((field) => {
      if (field.type === 'checkbox') {
        proposal.value[field.key] = false
      }
      if (field.type === 'number') {
        proposal.value[field.key] = field.min
      } else {
        proposal.value[field.key] = import.meta.env.PROD ? "" : 'flensburg'
      }
    })
  }
}


const loading = ref(false)
const formSubmitStatus = ref('edit')
const savedProposalId = ref(null)
const showSaveProposalDialog = ref(false)
const progressSaveProposal = ref([
  { name: "Öffentlichen Public Key Laden", status: 'doing' },
  { name: "Bewerbung Verschlüsseln", status: 'todo' },
  { name: "Bewerbung auf Server Speichern", status: 'todo' },
  { name: "Bewerbung ist gespeichert", status: 'todo' },
])


const onSubmit = async () => {
  loading.value = true
  try {
    if (proposal.value.captcha.toLowerCase() !== "flensburg") {
      formSubmitStatus.value = 'incorrect_captcha'
      return
    }
    showSaveProposalDialog.value = true
    const trackPublicKey = await loadPublicKey();
    const { encryptedData, encryptedSymatricKey } = await encryptUserProposal(trackPublicKey);
    savedProposalId.value = await saveProposal(encryptedData, encryptedSymatricKey);
    formSubmitStatus.value = 'success'
  } catch (error) {
    console.error(error);
    formSubmitStatus.value = 'error'
    loading.value = false
  }
};
const loadPublicKey = async () => {
  try {
    const response = await client.get(`/track/?slug=${route.query.proposal}`);
    progressSaveProposal.value[0].status = 'done'
    progressSaveProposal.value[1].status = 'doing'
    return JSON.parse(response.data.public_key);
  } catch (error) {
    console.error(error);
    progressSaveProposal.value[0].status = 'failed'
    throw error;
  }
};
const encryptUserProposal = async (userPublicKey) => {
  try {
    const encryptedProposal = await encryptProposalData(
      proposal.value,
      userPublicKey
    );
    progressSaveProposal.value[1].status = 'done'
    progressSaveProposal.value[2].status = 'doing'
    return encryptedProposal;
  } catch (error) {
    console.error(error);
    progressSaveProposal.value[1].status = 'failed'
    throw error;
  }
};
const saveProposal = async (encryptedData, encryptedSymatricKey) => {
  try {
    console.log('proposal', proposal)
    const name = proposal.value['title'] || 'Keine Name Vorhanden'
    const response = await createProposal(name, encryptedData, encryptedSymatricKey, route.query.proposal);
    progressSaveProposal.value[2].status = 'done'
    progressSaveProposal.value[3].status = 'done'
    return response;
  } catch (error) {
    console.error(error);
    progressSaveProposal.value[2].status = 'failed'
    throw error;
  }
};
</script>
<template>
  <main>
    <SaveProposalDialog :visible="showSaveProposalDialog" :events="progressSaveProposal"
      :savedProposalId="savedProposalId" />
    <Card v-if="showProposal && proposalData">
      <template #title>{{ i18n(proposalData.title) }}</template>
      <template #subtitle> {{ i18n(proposalData.description) }}
        <p>Deadline: {{ dayjs.unix(proposalData.deadline).format('DD.MM.YYYY HH:mm:ss') }} (MEZ)</p>
      </template>
      <template #content>
        <template v-if="formSubmitStatus === 'edit' || formSubmitStatus === 'incorrect_captcha'">
          <form @submit.prevent="onSubmit">
            <div v-for="field in proposalData.fields" class="flex flex-column gap-2 mt-4">
              <label :for="field.key">{{ i18n(field.label) }}</label>
              <template v-if="field.type === 'input'">
                <InputText :id="field.key" v-model="proposal[field.key]" :required="field.required"
                  :maxlength="field.max" />
              </template>
              <template v-else-if="field.type === 'number'">
                <InputNumber :id="field.key" v-model="proposal[field.key]" :required="field.required" :max="field.max"
                  :min="field.min" />
              </template>
              <template v-else-if="field.type === 'textarea'">
                <Textarea :id="field.key" v-model="proposal[field.key]" :required="field.required" :rows="field.rows || 5"
                  :maxlength="field.max" />
              </template>
              <template v-else-if="field.type === 'checkbox'">
                <Checkbox :id="field.key" v-model="proposal[field.key]" :binary="true" :required="field.required" />
              </template>
              <small>
                <span v-if="field.help">{{ i18n(field.help) }}</span>
                <span v-if="field.type != 'number' && field.max">
                  <span v-if="field.help">|</span> {{ i18n(proposalData.maxLength) }} {{ field.max }}
                </span>
              </small>
            </div>
            <Message v-if="formSubmitStatus === 'incorrect_captcha'" :closable="false" severity="error">
              {{ i18n(proposalData.incorectCaptchaMessage) }}
            </Message>
            <Button type="submit" :label="i18n(proposalData.submit)" :disabled="false" />
            <hr />
            Links
            <ul>
              <li v-for="link in proposalData.linklist">
                <a :href="link.target" target="_blank">{{ i18n(link.label) }}</a>
              </li>
            </ul>
          </form>
        </template>
        <template v-else-if="formSubmitStatus === 'success'">
          <Message :closable="false" severity="success">
            {{ i18n(proposalData.successMessage) }}
          </Message>
        </template>
        <template v-else-if="formSubmitStatus === 'error'">
          <Message :closable="false" severity="error">
            {{ i18n(proposalData.errorMessage) }}
          </Message>
          <Textarea :rows="5" :modelValue="JSON.stringify(proposal)" />
        </template>
      </template>
    </Card>
    <div v-else>
      <Message v-if="proposalData?.deadline && proposalData.deadline < dayjs().unix()" :closable="false" severity="error">
        The deadline {{ dayjs.unix(proposalData.deadline).format('DD.MM.YYYY HH:mm:ss') }} (MEZ) is already over... ()
      </Message>
      <AllProposals />
      Software: <a href="https://github.com/chaostreff-flensburg/pretty-good-proposal"
        target="_blank">pretty-good-proposal (github)</a>
    </div>
  </main>
</template>
