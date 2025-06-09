<script setup>
import { ref } from "vue";
import { client } from "../../lib/api";
import { useRouter } from "vue-router";
import CreateTrack from "../../components/CreateTrack.vue";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const router = useRouter();

const tracks = ref([])
const users = ref([])
const usernameInput = ref([])
const userEmailEditInput = ref([])

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
    for (const user of users.value) {
        userEmailEditInput.value[user.id] = user.email
    }
}
const addUserToTrack = async (track_id) => {
    const response = await client.post('track/users', {
        username: usernameInput.value[track_id],
        track_id: track_id
    })
    console.log(response)
    if (response.status === 200) {
        await loadTracks()
        toast.add({ severity: 'success', summary: 'Benutzer wurde hinzugefügt', life: 10000 });
    } else {
        alert('Benutzer konnte nicht hinzugefügt werden')
    }
    usernameInput.value[track_id] = ''
}
const onSubmitNewUser = async () => {
    try {
        const response = await client.post('user', {
            email: email.value,
            username: username.value,
            password: password.value
        })
        console.log(response)
        if (response.status === 201) {
            console.log("Toast status success");

            toast.add({ severity: 'success', summary: 'Benutzy wurde angelegt', life: 6000 });
        } else {
            console.log("Toast status error");

            toast.add({ severity: 'error', summary: `Fehler: ${response}`, life: 6000 });
        }
        email.value = ''
        username.value = ''
        password.value = ''
        loadUsers()
    } catch (error) {
        toast.add({ severity: 'error', summary: `Fehler: ${error}`, life: 6000 });
    }
}
const updateUserEmail = async (userId) => {
    try {
        const response = await client.post(`user/${userId}`, {
            email: userEmailEditInput.value[userId],
        })
        console.log(response)
        toast.add({ severity: 'success', summary: 'Benutzy wurde geändert', life: 6000 });
        await loadUsers()
    } catch (error) {
        toast.add({ severity: 'error', summary: `Fehler: ${error}`, life: 6000 });
    }
}
loadTracks()
loadUsers()
</script>
<template>
    <Toast />
    <h1>Root Verwaltung</h1>
    <h2>Tracks</h2>
    <section v-if="tracks.length">
        <ul>
            <li v-for="track in tracks" :key="track.id">
                <b>{{ track.name }} |</b>
                Benutzy Hinzufügen:
                <InputText v-model="usernameInput[track.id]" type="text" required />
                <Button type="button" label="Hinzufügen" @click="addUserToTrack(track.id)" />
                <div>
                    Aktuelle Benutzys ({{ track.users.length }}): <span v-for="user in track.users">
                        {{ user.username }},
                    </span>
                </div>
            </li>
        </ul>
    </section>
    <section v-else>
        <p>Keine Tracks vorhanden</p>
    </section>

    <CreateTrack @reload-data="loadTracks()" />
    <h2>Neuen Benutzy Erstellen</h2>

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
            <li v-for="user in users" :key="user.id" class="mt-2">
                <b>{{ user.username }} | </b>
                <InputText v-model="userEmailEditInput[user.id]" type="text" />
                <Button class="ml-2" type="button" label="E-Mail-Adresse Bearbeiten"
                    @click="updateUserEmail(user.id)" />
            </li>
        </ul>
    </section>
    <hr />
</template>