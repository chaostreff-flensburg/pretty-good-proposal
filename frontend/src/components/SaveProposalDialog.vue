<script setup>
import Dialog from 'primevue/dialog';
import Timeline from 'primevue/timeline';
import 'primeicons/primeicons.css'

defineProps({
    visible: {
        type: Boolean,
        required: true
    },
    events: {
        type: Array,
        required: true
    },
    savedProposalId: {
        type: Number,
        required: false
    }
})
</script>
<template>
    <Dialog :visible="visible" :closable="true" modal header="Bewerbung Speichern" :style="{ width: '50rem' }"
        :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
        <p>
            Wir speichern jetzt deine Bewerbung. Dafür werden die Daten zuerst Verschlüsselt und dann auf unseren Server
            hinterlegt. Das kann einen moment dauern.
        </p>
        <Timeline :value="events">
            <template #content="slotProps">
                <span v-if="slotProps.item.status === 'doing'" class="pi pi-spin pi-spinner"></span>
                <span v-if="slotProps.item.status === 'todo'" class="pi pi-stop"></span>
                <span v-if="slotProps.item.status === 'done'" class="pi pi-check"></span>
                <span v-if="slotProps.item.status === 'failed'" class="pi pi-times"></span>
                {{ slotProps.item.name }}
            </template>
        </Timeline>
        <p v-if="savedProposalId">Deine Bewerbung wurde erfolgreich gespeichert und hat die ID:
            <code>{{ savedProposalId }}</code>
        </p>
    </Dialog>
</template>