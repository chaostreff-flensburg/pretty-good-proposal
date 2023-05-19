<script setup>
import Header from "../components/Header.vue";
import DynamicDialog from 'primevue/dynamicdialog';
</script>

<template>
  <Header />
  <DynamicDialog />
  <main>
    <router-view />
  </main>
</template>
