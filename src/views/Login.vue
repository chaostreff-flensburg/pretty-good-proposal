<script setup>
import AuthForm from "../components/AuthForm.vue";
import { onMounted } from "vue";
import { supabase } from "../supabase";
import { useRouter } from "vue-router";

const router = useRouter();

onMounted(async () => {
  const { data } = await supabase.auth.getSession();
  const currentUser = data.session?.user;
  if (currentUser)
    router.push({
      name: "orga",
    });
});
</script>
<template>
  <main>
    <div class="flex justify-content-center">
      <div class="flex flex-column gap-2">
        <h1>Login</h1>
        <AuthForm auth-modus="login" />
      </div>
    </div>
  </main>
</template>
