<script setup>
import { ref } from "vue";
import { client, user, setLogin } from "../../lib/api";
import Button from "primevue/button";
import InputText from "primevue/inputtext";

const me = ref([])

const loading = ref(false);
const email = ref("")
const username = ref("")

const oldPassword = ref("")
const newPassword = ref("")

const loadUser = async () => {
  try {
    const response = await client.get('user')
    me.value = response.data
    email.value = me.value.email
    username.value = me.value.username
  } catch (error) {
    console.error(error)
  }
}
const onSubmitProfileData = async () => {
  loading.value = true;
  try {
    const response = await client.post(`user/${me.value.id}`, {
      email: email.value,
      username: username.value
    })
    if (response.status === 200) {
      me.value = response.data
      setLogin(me.value)
      alert('Speichern war erfolgreich')
    } else {
      alert('Speichern war nicht erfolgreich')
    }

  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false;
  }
}
const onSubmitChangePassword = async () => {
  loading.value = true;
  try {
    const response = await client.post(`user/${me.value.id}/password`, {
      oldPassword: oldPassword.value,
      newPassword: newPassword.value
    })
    if (response.status === 200) {
      alert('Passwort wurde geändert')
    } else {
      alert('Passwort konnte nicht geändert werden')
    }

  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false;
  }
}
loadUser()
</script>
<template>
  <h1>Profil Verwalten</h1>
  <form @submit.prevent="onSubmitProfileData">
    <div class="field">
      <label>E-Mail-Adresse</label>
      <InputText class="w-full" v-model="email" type="email" required />
    </div>
    <div class="field">
      <label>Benutzer (andere Benutzer aus dem selben Track können diesen sehen)</label>
      <InputText class="w-full" v-model="username" type="text" required />
    </div>
    <Button :disabled="loading" type="submit" label="Speichern" />
  </form>

  <h2>Passwort Ändern</h2>

  <form @submit.prevent="onSubmitChangePassword">
    <div class="field">
      <label>Altes Passwort</label>
      <InputText class="w-full" v-model="oldPassword" type="password" required />
    </div>
    <div class="field">
      <label>Neues Passwort</label>
      <InputText class="w-full" v-model="newPassword" type="password" required />
    </div>
    <Button :disabled="loading" type="submit" label="Speichern" />
  </form>
  <hr />
  <h3>Profildaten Server</h3>
  <pre>{{ me }}</pre>
  <h3>Profildaten Browser Session</h3>
  <pre>{{ user }}</pre>
</template>
