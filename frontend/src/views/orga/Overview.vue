<script setup>
import { ref } from "vue";
import { client } from "../../lib/api";

const tracks = ref([])
const loadTracks = async () => {
    const response = await client.get('tracks')
    tracks.value = response.data
}
loadTracks()
</script>
<template>
    <h1>Moin!</h1>

    <p>
        Du bist aktuell in folgenden Tracks aktiv:
    </p>
    <section v-if="tracks.length">
        <ul>
            <li v-for="track in tracks" :key="track.id">
                <router-link :to="`/orga/track/${track.slug}`">{{ track.name }}</router-link>
            </li>
        </ul>
    </section>
    <section v-else>
        <p>Keine Tracks vorhanden</p>
    </section>
</template>