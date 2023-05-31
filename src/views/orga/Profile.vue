<script setup>
import AuthForm from "../../components/AuthForm.vue";
</script>
<template>
  <h1>Profil Verwalten</h1>
  <button @click="test">Neuen User anleen</button>
  <h3>Neuy Benutzy anlegen</h3>
  <AuthForm auth-modus="regestrieren" />
  <p>Benutzy muss anschließend noch manuell aktiviert werden</p>
</template>
