<script setup>
import { useRoute } from "vue-router";

const route = useRoute();
</script>
<template>
  <main>
    <div class="flex justify-content-center">
      <div class="flex flex-column gap-2">
        <template v-if="route.fullPath.includes('unauthorized_client')">
          <h1>Ein Fehler ist aufgetreten</h1>
          <p>Der Login-Link hat nicht funktioniert. Der Link funktioniert nur beim ersten Aufruf.</p>
        </template>
        <template v-else>
          <h1>Seite nicht gefunden</h1>
          <p>Die aufgerufene URL ist uns leider nicht bekannt.</p>
        </template>
      </div>
    </div>
  </main>
</template>
