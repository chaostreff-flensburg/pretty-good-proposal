<script setup>
import { ref, onMounted, defineProps } from "vue";
import { supabase } from "../supabase";
import { useToast } from "primevue/usetoast";
import { useRouter } from "vue-router";
import { useForm } from "vee-validate";
import { useConfirm } from "primevue/useconfirm";
import StatusDropdown from "./StatusDropdown.vue";
import ConfirmDialog from "primevue/confirmdialog";

const { handleSubmit } = useForm();

const toast = useToast();
const router = useRouter();
const confirm = useConfirm();

import ProgressSpinner from "primevue/progressspinner";
import Button from "primevue/button";
import Toast from "primevue/toast";

const { proposalId, proposalStatus } = defineProps([
  "proposalId",
  "proposalStatus",
]);

const loading = ref(false);
const statusForm = ref(null);

onMounted(() => {
  statusForm.value = proposalStatus;
});

const confirm1 = () => {
  confirm.require({
    message: "Are you sure you want to proceed?",
    header: "Confirmation",
    icon: "pi pi-exclamation-triangle",
    accept: () => {
      toast.add({
        severity: "info",
        summary: "Confirmed",
        detail: "You have accepted",
        life: 3000,
      });
    },
    reject: () => {
      toast.add({
        severity: "error",
        summary: "Rejected",
        detail: "You have rejected",
        life: 3000,
      });
    },
  });
};

const updateProposalStatus = async () => {
  loading.value = true;
  try {
    await supabase
      .from("proposals")
      .update({ status: statusForm.value })
      .eq("id", proposalId)
      .throwOnError();
    router.go();
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

const onSubmit = handleSubmit(async (values, actions) => {
  confirm.require({
    message: "Bist du sicher du willst den Status der Bewerbung verändern?",
    header: "Bestätigung",
    icon: "pi pi-exclamation-triangle",
    accept: async () => {
      await updateProposalStatus();
    },
  });
});
</script>

<template>
  <Toast />
  <ConfirmDialog></ConfirmDialog>
  <ProgressSpinner v-if="loading" />
  <form @submit="onSubmit">
    <div class="flex-auto">
      <label for="vote" class="font-bold block mb-2">
        Neuer Bewerbungsstatus
      </label>
      <StatusDropdown v-model="statusForm" />
    </div>
    <Button type="submit" label="Speichern" />
  </form>
</template>
