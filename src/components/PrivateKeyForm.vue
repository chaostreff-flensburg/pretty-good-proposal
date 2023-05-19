<script setup>
import Textarea from "primevue/textarea";
import Button from "primevue/button";
import { ref, inject } from "vue";

const dialogRef = inject("dialogRef");

const privateKey = ref("");
</script>

<template>
  <form @submit.prevent="dialogRef.close({ privateKey })">
    <div class="formgrid grid">
      <div class="field col flex flex-column">
        <label for="key">Private Key</label>
        <Textarea id="key" v-model="privateKey" :rows="8" required />
      </div>
    </div>
    <Button type="submit" label="Bestaetigen" />
  </form>
</template>
