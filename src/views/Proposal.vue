<script setup>
import { ref } from "vue";
import { createProposal } from "../lib/api";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import Button from "primevue/button";
import Checkbox from "primevue/checkbox";
import Card from 'primevue/card';
import ProgressSpinner from "primevue/progressspinner";
import Message from 'primevue/message';

const proposal = ref({
  name: "",
  pronoun: "",
  email: "",
  phonenumber: "",
  hochschule: "",
  startdate: "",
  thesisName: "",
  institutProfessor: "",
  thesisTask: "",
  reasonApplicationThesis: "",
  reasonApplicationPerson: "",
  captcha: "",
  approval: false,
});
const loading = ref(false)
const formSubmitStatus = ref('edit')

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
const onSubmit = async () => {
  loading.value = true
  console.log('proposal.value', proposal.value)
  console.log('loading.value', loading.value)
  try {
    if (proposal.value.captcha.toLowerCase() !== "flensburg")
      throw Error("Wrong Captcha");
    await createProposal(proposal.value);
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
  <Card>
    <template #title> Jetzt Bewerben </template>
    <template #subtitle> <a href="https://ccs.chaostreff-flensburg.de/" target="_blank">Alle Informationen zum #CCS
        Chaotischer
        Catalysator Stipendien</a> </template>
    <template #content>
      <template v-if="loading">
        <ProgressSpinner />
        Wir speichern deine Bewerbung.<br />
        Das kann ein paar Sekunden dauern.
      </template>
      <template v-else>
        <template v-if="formSubmitStatus === 'edit'">
          <form @submit.prevent="onSubmit">
            <div class="formgrid grid ">
              <div class="field col flex flex-column">
                <label for="username">Name</label>
                <InputText id="username" v-model="proposal.name" required />
              </div>
              <div class="field col flex flex-column">
                <label for="pronoun">Pronomen (optional)</label>
                <InputText id="pronoun" v-model="proposal.pronoun" required />
              </div>
            </div>
            <div class="formgrid grid ">
              <div class="field col flex flex-column">
                <label for="email">E-Mail-Adresse</label>
                <InputText id="email" v-model="proposal.email" required />
              </div>
              <div class="field col flex flex-column">
                <label for="phonenumber">Telefonnummer (optional)</label>
                <InputText id="phonenumber" v-model="proposal.phonenumber" aria-describedby="phonenumber-help" />
                <small id="phonenumber-help">bitte leerlassen wenn nur per E-Mail kommuniziert werden soll</small>
              </div>
            </div>
            <div class="formgrid grid">
              <div class="field col flex flex-column">
                <label for="hochschule">Hochschule/Universität</label>
                <InputText id="hochschule" v-model="proposal.hochschule" required />
              </div>
              <div class="field col flex flex-column">
                <label for="startdate">(geplantes) Startdatum</label>
                <InputText id="startdate" v-model="proposal.startdate" required />
              </div>
            </div>
            <div class="field flex flex-column">
              <label for="thesisName">Titel der Masterarbeit</label>
              <InputText id="thesisName" v-model="proposal.thesisName" required />
            </div>
            <div class="field flex flex-column">
              <label for="institutProfessor">Institut/Professur (optional)</label>
              <InputText id="institutProfessor" v-model="proposal.institutProfessor" />
            </div>
            <div class="field flex flex-column">
              <label for="thesisTask">Wie ist die Aufgabenstellung deiner Arbeit? max. 1000 Zeichen</label>
              <Textarea v-model="proposal.thesisTask" rows="5" max="1000" required />
            </div>
            <div class="field flex flex-column">
              <label for="reasonApplicationThesis">
                Warum passt deine Arbeit ins Thema? max. 1000 Zeichen</label>
              <Textarea v-model="proposal.reasonApplicationThesis" rows="7" max="1000" required />
            </div>
            <div class="field flex flex-column">
              <label for="reasonApplicationPerson">Erzähl uns etwas über dich? max. 1000 Zeichen</label>
              <Textarea v-model="proposal.reasonApplicationPerson" rows="7" max="1000" required />
            </div>
            <div class="field flex flex-column">
              <label for="captcha">Captcha: Aus welcher Stadt kommt der <a href="https://chaostreff-flensburg.de/"
                  target="_blank">Chaostreff Flensburg
                  e.V.?</a></label>
              <InputText id="captcha" v-model="proposal.captcha" required />
            </div>
            <div class="field">
              <Checkbox v-model="proposal.approval" :binary="true" required />
              Ich habe die <a href="https://ccs.chaostreff-flensburg.de/#stipendiumsbedingungen"
                target="_blank">Stipendiumsbedingungen</a> gelesen und willige ein
            </div>
            <Button type="submit" :disabled="proposal.captcha.toLowerCase() !== 'flensburg'" label="Abschicken" />
          </form>
        </template>
        <template v-else-if="formSubmitStatus === 'success'">
          <Message :closable="false" severity="success">
            🥳 Wir haben deine Bewerbung erfolgreich gespeichert. 🎉<br />
            Es kann einige Wochen dauern, bis du eine Zu- oder Absage erhältst. Bei Fragen kannst du dich an
            ccs@chaostreff-flensburg.de wenden.
          </Message>
        </template>
        <template v-else-if="formSubmitStatus === 'error'">
          <Message :closable="false" severity="error">
            Deine Bewerbung konnte leider nicht gespeichert werden. Bitte überprüfe, ob du mit dem Internet verbunden
            bist.<br />
            Alternativ kannst du den untenstehenden Text kopieren und per E-Mail an
            ccs@chaostreff-flensburg.de
            senden.
          </Message>
          <Textarea :rows="5" :modelValue="JSON.stringify(proposal)" />
        </template>
      </template>
    </template>
  </Card>
</template>
