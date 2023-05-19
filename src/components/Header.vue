<script setup>
import { useRoute, useRouter } from "vue-router";
import { supabase } from "../supabase";
import Menubar from "primevue/menubar";
import Button from "primevue/button";

const router = useRouter();
const route = useRoute();

const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) console.error(error);
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
