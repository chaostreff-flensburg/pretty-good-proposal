<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "../supabase";
import { useToast } from "primevue/usetoast";
import { useRouter } from "vue-router";
import { useForm } from "vee-validate";
const { handleSubmit } = useForm();
const toast = useToast();
const router = useRouter();

import InputNumber from "primevue/inputnumber";
import ProgressSpinner from "primevue/progressspinner";
import Textarea from "primevue/textarea";
import Button from "primevue/button";
import Toast from "primevue/toast";

const { proposalId, myOpinion, currentUserId } = defineProps([
  "proposalId",
  "myOpinion",
  "currentUserId",
]);

const loading = ref(false);
const opinionForm = ref({
  vote: null,
  comment: null,
});

onMounted(() => {
  opinionForm.value.id = myOpinion?.id;
  opinionForm.value.vote = myOpinion?.vote;
  opinionForm.value.comment = myOpinion?.comment;
});

const onSubmit = handleSubmit(async (values, actions) => {
  loading.value = true;
  try {
    opinionForm.value = {
      ...opinionForm.value,
      profile_id: currentUserId,
      proposal_id: proposalId,
    };
    await supabase.from("opinions").upsert(opinionForm.value).throwOnError();
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
});
</script>

<template>
  <Toast />
  <ProgressSpinner v-if="loading" />
  <form @submit="onSubmit">
    <div class="flex-auto">
      <label for="vote" class="font-bold block mb-2"> Deine Stimme (-1 bis +1) </label>
      <InputNumber class="w-full" v-model="opinionForm.vote" :min-fraction-digits="1" :step="0.1" :min="-1" :max="1"
        locale="de-DE" input-id="vote" />
    </div>
    <div class="flex-auto">
      <label for="comment" class="font-bold block mb-2">Kommentar</label>
      <Textarea class="w-full" id="comment" v-model="opinionForm.comment" />
    </div>
    <Button :disabled="loading" type="submit" label="Speichern" />
  </form>
</template>
