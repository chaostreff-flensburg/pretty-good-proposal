<script setup>
import { ref } from "vue";
import { client } from "../../lib/api";
import CreateTrack from "../../components/CreateTrack.vue";
import InputText from "primevue/inputtext";
import Button from "primevue/button";

const tracks = ref([])
const users = ref([])
const usernameInput = ref([])

const email = ref("")
const username = ref("")
const password = ref("")

const loadTracks = async () => {
    const response = await client.get('tracks')
    tracks.value = response.data
}
const loadUsers = async () => {
    const response = await client.get('users')
    users.value = response.data
}
const addUserToTrack = async (track_id) => {
    const response = await client.post('track/users', {
        username: usernameInput.value[track_id],
        track_id: track_id
    })
    console.log(response)
    if (response.status === 200) {
        alert('Benutzer wurde hinzugefügt')
    } else {
        alert('Benutzer konnte nicht hinzugefügt werden')
    }
    usernameInput.value[track_id] = ''
}
const onSubmitNewUser = async () => {
    const response = await client.post('user', {
        email: email.value,
        username: username.value,
        password: password.value
    })
    console.log(response)
    if (response.status === 201) {
        alert('Benutzer wurde erstellt')
    } else {
        alert('Benutzer konnte nicht erstellt werden')
    }
    email.value = ''
    username.value = ''
    password.value = ''
    loadUsers()
}
loadTracks()
loadUsers()
</script>
<template>
    <h1>Root Verwaltung</h1>
    <h2>Tracks</h2>
    <section v-if="tracks.length">
        <ul>
            <li v-for="track in tracks" :key="track.id">
                {{ track.name }} |
                Benutzy Hinzufügen
                <InputText v-model="usernameInput[track.id]" type="text" required />
                <Button type="button" label="Hinzufügen" @click="addUserToTrack(track.id)" />
            </li>
        </ul>
    </section>
    <section v-else>
        <p>Keine Tracks vorhanden</p>
    </section>

    <CreateTrack />
    <h2>Benutzy Erstellen</h2>

    <form @submit.prevent="onSubmitNewUser">
        <div class="field">
            <label>E-Mail-Adresse</label>
            <InputText class="w-full" v-model="email" type="email" required />
        </div>
        <div class="field">
            <label>Benutzername</label>
            <InputText class="w-full" v-model="username" type="text" required />
        </div>
        <div class="field">
            <label>Passwort</label>
            <InputText class="w-full" v-model="password" type="password" required />
        </div>
        <Button :disabled="loading" type="submit" label="Speichern" />
    </form>
    <h2>Liste aller Benutzy</h2>
    <section v-if="users.length">
        <ul>
            <li v-for="user in users" :key="user.id">
                {{ user.username }} | {{ user.email }}
            </li>
        </ul>
    </section>
    <hr />
</template>