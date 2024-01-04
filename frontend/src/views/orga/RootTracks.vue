<script setup>
import { ref } from "vue";
import { client } from "../../lib/api";
import CreateTrack from "../../components/CreateTrack.vue";
import InputText from "primevue/inputtext";
import Button from "primevue/button";

const tracks = ref([])
const usernameInput = ref([])

const loadTracks = async () => {
    const response = await client.get('tracks')
    tracks.value = response.data
}
const addUser = async (track_id) => {
    const response = await client.post('track/users', {
        username: usernameInput.value[track_id],
        track_id: track_id
    })
    console.log(response)
    usernameInput.value[track_id] = ''
}
loadTracks()
</script>
<template>
    <h1>Tracks</h1>
    <section v-if="tracks.length">
        <ul>
            <li v-for="track in tracks" :key="track.id">
                {{ track.name }} |
                Benuty Hinzufügen
                <InputText v-model="usernameInput[track.id]" type="text" required />
                <Button type="button" label="Hinzufügen" @click="addUser(track.id)" />
            </li>
        </ul>
        <h2>Benuty Hinzufügen</h2>

    </section>
    <section v-else>
        <p>Keine Tracks vorhanden</p>
    </section>
    <hr />
    <CreateTrack />
</template>