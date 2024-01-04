<script setup>
import { useRoute, useRouter } from "vue-router";
import { setLogout } from '../lib/api'
import lf from "localforage";
import Menubar from "primevue/menubar";
import Button from "primevue/button";

const router = useRouter();
const route = useRoute();

const logout = async () => {
  await lf.clear();
  setLogout()
  router.push({
    name: "login",
  });
};

const items = [
  {
    label: "Übersicht",
    to: "/orga",
  },
  {
    label: "Profil",
    to: "/orga/profile",
  },
  {
    label: "FAQ",
    to: "/orga/faq",
  },
];
</script>
<template>
  <header>
    <Menubar :model="items">
      <template #start> #CCS Pretty Good Propopsal </template>
      <template #end>
        <Button label="Logout" @click="logout" />
      </template>
    </Menubar>
  </header>
</template>
