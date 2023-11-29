<script setup>
import { ref } from "vue";
import { createProposal } from "../lib/api";
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import Textarea from "primevue/textarea";
import Button from "primevue/button";
import Checkbox from "primevue/checkbox";
import Card from 'primevue/card';
import ProgressSpinner from "primevue/progressspinner";
import Message from 'primevue/message';
//import i18n from "../lib/i18n.json"
import { useRoute } from 'vue-router'
import { proposals } from '../proposals/index.js'
import dayjs from "dayjs";
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(timezone)
dayjs.tz.setDefault("Berlin/Eruope")


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
        proposal.value[field.key] = ""
      }
    })
  }
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

const loading = ref(false)
const formSubmitStatus = ref('edit')


/*
if (!import.meta.env.PROD) {
  proposal.value = {
    name: "Beate Beispiel",
    pronoun: "he/her",
    email: "ccs+dev@chaostreff-flensburg.de",
    phonenumber: "00123-45678",
    hochschule: "Test Hochschule",
    startdate: "04.05.2023",
    thesisName:
      "TEST Konzeption Intergelaktische Gemeinnschaften in Dunklen Zeiten",
    institutProfessor: "Beispiel Institut",
    thesisTask:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Volutpat blandit aliquam etiam erat. Ullamcorper eget nulla facilisi etiam dignissim diam quis. At in tellus integer feugiat scelerisque varius. Mauris nunc congue nisi vitae suscipit tellus mauris. Ullamcorper morbi tincidunt ornare massa eget egestas purus viverra. In fermentum et sollicitudin ac. Aliquet nibh praesent tristique magna sit amet purus gravida quis. Sed arcu non odio euismod lacinia at quis. Habitant morbi tristique senectus et. Sed odio morbi quis commodo odio aenean sed adipiscing diam. Feugiat scelerisque varius morbi enim nunc faucibus a. Arcu dictum varius duis at consectetur lorem donec massa. Nulla aliquet enim tortor at auctor urna nunc id. Nec feugiat in fermentum posuere. Proin nibh nisl condimentum id venenatis a condimentum vitae. Sed cras ornare arcu dui. Massa vitae tortor condimentum lacinia quis vel eros donec ac. Et ligula ulla",
    reasonApplicationThesis:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Volutpat blandit aliquam etiam erat. Ullamcorper eget nulla facilisi etiam dignissim diam quis. At in tellus integer feugiat scelerisque varius. Mauris nunc congue nisi vitae suscipit tellus mauris. Ullamcorper morbi tincidunt ornare massa eget egestas purus viverra. In fermentum et sollicitudin ac. Aliquet nibh praesent tristique magna sit amet purus gravida quis. Sed arcu non odio euismod lacinia at quis. Habitant morbi tristique senectus et. Sed odio morbi quis commodo odio aenean sed adipiscing diam. Feugiat scelerisque varius morbi enim nunc faucibus a. Arcu dictum varius duis at consectetur lorem donec massa. Nulla aliquet enim tortor at auctor urna nunc id. Nec feugiat in fermentum posuere. Proin nibh nisl condimentum id venenatis a condimentum vitae. Sed cras ornare arcu dui. Massa vitae tortor condimentum lacinia quis vel eros donec ac. Et ligula ulla",
    reasonApplicationPerson:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Volutpat blandit aliquam etiam erat. Ullamcorper eget nulla facilisi etiam dignissim diam quis. At in tellus integer feugiat scelerisque varius. Mauris nunc congue nisi vitae suscipit tellus mauris. Ullamcorper morbi tincidunt ornare massa eget egestas purus viverra. In fermentum et sollicitudin ac. Aliquet nibh praesent tristique magna sit amet purus gravida quis. Sed arcu non odio euismod lacinia at quis. Habitant morbi tristique senectus et. Sed odio morbi quis commodo odio aenean sed adipiscing diam. Feugiat scelerisque varius morbi enim nunc faucibus a. Arcu dictum varius duis at consectetur lorem donec massa. Nulla aliquet enim tortor at auctor urna nunc id. Nec feugiat in fermentum posuere. Proin nibh nisl condimentum id venenatis a condimentum vitae. Sed cras ornare arcu dui. Massa vitae tortor condimentum lacinia quis vel eros donec ac. Et ligula ulla",
    captcha: "flensburg",
    approval: false,
  };
}
*/
const onSubmit = async () => {
  loading.value = true
  try {
    if (proposal.value.captcha.toLowerCase() !== "flensburg")
      throw Error("Wrong Captcha");
    console.log(proposal.value)
    //await createProposal(proposal.value);
    formSubmitStatus.value = 'success'
  } catch (error) {
    console.error(error);
    formSubmitStatus.value = 'error'
  }
  finally {
    loading.value = false
  }
};
</script>
<template>
  <main>
    <Card v-if="showProposal && proposalData">
      <template #title>{{ i18n(proposalData.title) }}</template>
      <template #subtitle> {{ i18n(proposalData.description) }}
        <p>Deadline: {{ dayjs.unix(proposalData.deadline).format('DD.MM.YYYY HH:mm:ss') }} (MEZ)</p>
      </template>
      <template #content>
        <template v-if="loading">
          <ProgressSpinner />
          {{ i18n(proposalData.saveMessage) }}
        </template>
        <template v-else>
          <template v-if="formSubmitStatus === 'edit'">
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
                  <Textarea :id="field.key" v-model="proposal[field.key]" :required="field.required"
                    :rows="field.rows || 5" :maxlength="field.max" />
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
              <Button type="submit" :label="i18n(proposalData.submit)" />
              <hr />
              Links
              <ul>
                <li v-for="link in proposalData.linklist">
                  <a :href="link.target" target="_blank">{{ i18n(link.label) }}</a>
                </li>
              </ul>
              <hr />
              <pre>{{ proposal }}</pre>
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
      </template>
    </Card>
    <div v-else>


      <Message v-if="proposalData.deadline && proposalData.deadline < dayjs().unix()" :closable="false" severity="error">
        The deadline {{ dayjs.unix(proposalData.deadline).format('DD.MM.YYYY HH:mm:ss') }} (MEZ) is already over... ()
      </Message>
      <h2>All proposals on this instance</h2>
      <ul>
        <li v-for="proposal in Object.keys(proposals)">
          <router-link :to="{ path: '/', query: { proposal: proposal } }">
            {{
              i18n(
                proposals[proposal].title) }}
            | Deadline: {{ dayjs.unix(proposals[proposal].deadline).format('DD.MM.YYYY HH:mm:ss') }} (MEZ)
          </router-link>
        </li>
      </ul>
      Software: <a href="https://github.com/chaostreff-flensburg/pretty-good-proposal"
        target="_blank">pretty-good-proposal (github)</a>
    </div>
  </main>
</template>
