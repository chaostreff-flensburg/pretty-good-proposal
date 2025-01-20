<script setup>
import { ref, onMounted } from "vue";
import { client } from "../lib/api";
import { useToast } from "primevue/usetoast";
import { useRouter } from "vue-router";
import { useConfirm } from "primevue/useconfirm";
import ConfirmDialog from "primevue/confirmdialog";

const toast = useToast();
const router = useRouter();
const confirm = useConfirm();

import ProgressSpinner from "primevue/progressspinner";
import Button from "primevue/button";
import Toast from "primevue/toast";

const { proposalId, proposalStatus } = defineProps([
  "proposalId",
]);

const loading = ref(false);
const statusForm = ref(null);

onMounted(() => {
  statusForm.value = proposalStatus;
});

const deleteProposal = async () => {
  loading.value = true;
  try {
    await client.delete(`proposal/${proposalId}`);
    router.push('/orga');
    toast.add({
      severity: "success",
      summary: "Gelöscht",
      detail: "Bewerbung wure gelöscht",
      life: 5000,
    });
  } catch (error) {
    console.error(error);
    toast.add({
      severity: "warn",
      summary: "Error",
      detail: error?.message || "Beim laden ist ein Fehler aufgetrente",
      life: 5000,
    });
  } finally {
    loading.value = false;
  }
};

const confirmDeleteProposal = async () => {
  confirm.require({
    message: "Bist du sicher du diese Bewerbung Löschen möchtest?",
    header: "Bestätigung",
    icon: "pi pi-exclamation-triangle",
    accept: async () => {
      await deleteProposal();
    },
  });
}
</script>

<template>
  <Toast />
  <ConfirmDialog></ConfirmDialog>
  <ProgressSpinner v-if="loading" />
  <Button v-else class="mt-2" type="submit" label="Löschen" @click="confirmDeleteProposal()" />
</template>
