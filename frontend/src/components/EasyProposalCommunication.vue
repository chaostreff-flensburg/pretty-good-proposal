<template>
    <template v-if="proposal.status === 'rejected' || proposal.status === 'accepted'">
        <h2 v-if="proposal.status === 'rejected'">E-Mail Texte Ablehnung</h2>
        <h2 v-else="proposal.status === 'accepted'">E-Mail Texte Ablehnung</h2>

        <a :href="`mailto:${answer.email}?subject=${answer.de.subject}&body=${answer.de.body}`">Antwort Sprache:
            de_DE</a><br />
        <a :href="`mailto:${answer.email}?subject=${answer.en.subject}&body=${answer.en.body}`">Antwort Sprache:
            en_GB</a>
    </template>
</template>
<script setup>
import { ref } from 'vue'
import { newProposalStatusEmailTemplate } from '../lib/communication.js'

const props = defineProps({
    proposal: {
        type: Object
    }
});

const answer = ref({
    email: props?.proposal?.data?.email,
    de: {
        subject: newProposalStatusEmailTemplate.de.subject.replaceAll(' ', '%20'),
        body: `${newProposalStatusEmailTemplate.de[props.proposal?.status]?.body}${newProposalStatusEmailTemplate.generalFooter}`.replaceAll(' ', '%20').replaceAll('\n', '%0A')

    },
    en: {
        subject: newProposalStatusEmailTemplate.en.subject.replaceAll(' ', '%20'),
        body: `${newProposalStatusEmailTemplate.en[props.proposal?.status]?.body}${newProposalStatusEmailTemplate.generalFooter}`.replaceAll(' ', '%20').replaceAll('\n', '%0A')
    }
})
</script>