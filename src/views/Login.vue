<script setup>
import { onMounted, ref } from "vue";
import { supabase } from "../supabase";
import { useRouter } from "vue-router";
import Toast from "primevue/toast";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import { useToast } from "primevue/usetoast";

const loading = ref(false);
const email = ref("samuel.brinkmann@gmail.com");
const toast = useToast();
const router = useRouter();

onMounted(async () => {
  const { data } = await supabase.auth.getSession();
  const currentUser = data.session?.user;
  if (currentUser)
    router.push({
      name: "overview",
    });
});

const handleLogin = async () => {
  try {
    loading.value = true;
    const { error } = await supabase.auth.signInWithOtp({
      email: email.value,
      options: {
        emailRedirectTo: "http://localhost:5173/#/login?",
        shouldCreateUser: false,
      },
    });
    if (error) throw error;
    toast.add({
      severity: "success",
      summary: "📨",
      detail: "Check your email for the login link!",
      life: 50000,
    });
  } catch (error) {
    if (error instanceof Error) {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: error?.message || "Beim laden ist ein Fehler aufgetrente",
        life: 50000,
      });
    }
  } finally {
    loading.value = false;
  }
};
</script>
<template>
  <Toast />
  <div class="flex justify-content-center">
    <div class="flex flex-column gap-2">
      <h1>Login</h1>
      <InputText v-model="email" type="email" />
      <Button label="Jetzt Anmelden" @click="handleLogin" />
    </div>
  </div>
</template>
