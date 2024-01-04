<script setup>
import { generateKeypair } from "../../lib/crypto"
import Button from "primevue/button";
const onGenerateKeypair = async () => {
  console.log(await generateKeypair())
}
</script>
<template>
  <h1>Profil Verwalten</h1>
  <hr />
  <h3>RSA Keypair generieren</h3>
  <Button @click="onGenerateKeypair" label="Generieren (ausgabe in der Konsole)" />
</template>
