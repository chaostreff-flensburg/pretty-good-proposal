<script setup>
import { ref } from "vue";
import { createProposal } from "../lib/api";
import { useForm } from "vee-validate";
const { handleSubmit } = useForm();
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import Button from "primevue/button";
import Checkbox from "primevue/checkbox";

const proposal = ref({
  name: "TEST Konzeption Intergelaktische Gemeinnschaften in Dunklen Zeiten",
  pronoun: "he/him",
  email: "kontakt@samuelbrinkmann.de",
  phonenumber: "",
  hochschule: "",
  startdate: "",
  thesisName: "",
  institutProfessor: "",
  thesisTask: "",
  reasonApplicationThesis: "",
  reasonApplicationPerson: "",
  captcha: "flensburg",
  approval: false,
});
proposal.value = {
  name: "Beate Beispiel",
  pronoun: "he/him",
  email: "kontakt@samuelbrinkmann.de",
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
const onSubmit = handleSubmit(async (values, actions) => {
  try {
    if (proposal.value.captcha.toLowerCase() !== "flensburg")
      throw Error("Wrong Captcha");
    await createProposal(proposal.value);
  } catch (error) {
    console.error(error);
  }
});
</script>
<template>
  <div class="card">
    <h2>Jetzt Bewerben</h2>
    <form @submit="onSubmit">
      <div class="formgrid grid">
        <div class="field col flex flex-column">
          <label for="username">Name</label>
          <InputText id="username" v-model="proposal.name" />
        </div>
        <div class="field col flex flex-column">
          <label for="pronoun">Pronomen (optional)</label>
          <InputText id="pronoun" v-model="proposal.pronoun" />
        </div>
      </div>
      <div class="formgrid grid">
        <div class="field col flex flex-column">
          <label for="email">E-Mail-Adresse</label>
          <InputText id="email" v-model="proposal.email" />
        </div>
        <div class="field col flex flex-column">
          <label for="phonenumber">Telefonnummer (optional)</label>
          <InputText id="phonenumber" v-model="proposal.phonenumber" />
        </div>
      </div>
      <div class="formgrid grid">
        <div class="field col flex flex-column">
          <label for="hochschule">Hochschule/Universität</label>
          <InputText id="hochschule" v-model="proposal.hochschule" />
        </div>
        <div class="field col flex flex-column">
          <label for="startdate">(geplantes) Startdatum</label>
          <InputText id="startdate" v-model="proposal.startdate" />
        </div>
      </div>
      <div class="field col flex flex-column">
        <label for="thesisName">Titel der Masterarbeit</label>
        <InputText id="thesisName" v-model="proposal.thesisName" />
      </div>
      <div class="field col flex flex-column">
        <label for="institutProfessor">Institut/Professur (optional)</label>
        <InputText
          id="institutProfessor"
          v-model="proposal.institutProfessor"
        />
      </div>
      <div class="field col flex flex-column">
        <label for="thesisTask"
          >Wie ist die Aufgabenstellung deiner Arbeit? max. 1000 Zeichen</label
        >
        <Textarea v-model="proposal.thesisTask" rows="2" max="1000" />
      </div>
      <div class="field col flex flex-column">
        <label for="reasonApplicationThesis">
          Warum passt deine Arbeit ins Thema? max. 1000 Zeichen</label
        >
        <Textarea
          v-model="proposal.reasonApplicationThesis"
          rows="5"
          max="1000"
        />
      </div>
      <div class="field col flex flex-column">
        <label for="reasonApplicationPerson"
          >Erzähl uns etwas über dich? max. 1000 Zeichen</label
        >
        <Textarea
          v-model="proposal.reasonApplicationPerson"
          rows="5"
          max="1000"
        />
      </div>
      <div class="field col flex flex-column">
        <label for="captcha"
          >Captcha: Aus welcher Stadt kommt der <a href="https://chaostreff-flensburg.de/" target="_blank">Chaostreff Flensburg
          e.V.?</a></label
        >
        <InputText id="captcha" v-model="proposal.captcha" />
      </div>
      <div class="field col">
        <Checkbox v-model="proposal.approval" :binary="true" />
        Ich habe die <a href="https://ccs.chaostreff-flensburg.de/#stipendiumsbedingungen" target="_blank">Stipendiumsbedingungen</a> gelesen und willige ein
      </div>
      <Button type="submit" label="Abschicken" />
    </form>
  </div>
</template>
