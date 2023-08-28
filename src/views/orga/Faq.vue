<script setup>
import { newProposalStatusEmailTemplate } from '../../lib/communication.js'
</script>
<template>
  <h1>FAQ</h1>
  <h2>Login</h2>
  Der Login funktioniert nur über einen "Magic Sign in" Link der per E-Mail zugeschickt wird. Dieser Link muss
  anschließend nur noch geöffnet werden.
  geöffent werden
  <h2>Texte E-Mail Versand - Ohne angezeigte Formatierung neue Zeile</h2>
  <h3>Deutsch de_DE</h3>
  <h4>Betreff</h4>
  {{ newProposalStatusEmailTemplate.de.subject }}
  <h4>Footer</h4>
  {{ newProposalStatusEmailTemplate.generalFooter }}
  <h4>Zusage </h4>
  {{ newProposalStatusEmailTemplate.de.accepted.body }}
  <h4>Ablehnung</h4>
  {{ newProposalStatusEmailTemplate.de.rejected.body }}
  <h3>Englsich en_GB</h3>
  <h4>Betreff</h4>
  {{ newProposalStatusEmailTemplate.en.subject }}
  <h4>Footer</h4>
  {{ newProposalStatusEmailTemplate.generalFooter }}
  <h4>Zusage</h4>
  {{ newProposalStatusEmailTemplate.en.accepted.body }}
  <h4>Ablehnung</h4>
  {{ newProposalStatusEmailTemplate.en.rejected.body }}
</template>
