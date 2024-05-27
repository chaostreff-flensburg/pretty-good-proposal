<script setup>
import { i18n } from "../lib/api";
import { proposals } from '../proposals/index.js'
import dayjs from "dayjs";
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(timezone)
dayjs.tz.setDefault("Berlin/Eruope")
</script>
<template>
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
</template>