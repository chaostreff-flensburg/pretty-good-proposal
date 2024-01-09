<script setup>
import { useRouter, useRoute } from "vue-router";
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
    route: "/orga",
  },
  {
    label: "Profil",
    route: "/orga/profile",
  },
  {
    label: "FAQ",
    route: "/orga/faq",
  },
];
</script>
<template>
  <header>
    <Menubar :model="items">
      <template #start> Pretty Good Propopsal V2

      </template>
      <template #item="{ item, props }">
        <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
          <a v-ripple :href="href" v-bind="props.action" @click="navigate">
            <span class="ml-2">{{ item.label }}</span>
          </a>
        </router-link>
      </template>
      <template #end>
        <Button label="Logout" @click="logout" />
      </template>
    </Menubar>
  </header>
</template>
