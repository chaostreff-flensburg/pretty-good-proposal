<script setup>
import { ref } from "vue";
import { status } from "../lib/const";
import Dropdown from "primevue/dropdown";
const statusForm = ref(null);
const statusOptions = Object.keys(status).map((item) => {
  return {
    name: status[item].name,
    code: item,
  };
});
</script>

<template>
  <Dropdown
    :options="statusOptions"
    option-label="name"
    option-value="code"
    class="w-full md:w-14rem"
  />
</template>
