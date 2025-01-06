<script setup>
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Toast from 'primevue/toast';
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { client, setLogin } from "../lib/api";
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const router = useRouter();
const route = useRoute();

const loading = ref(false);
const email = ref(import.meta.env.PROD ? "" : "samuel+root@chaostreff-flensburg.de");
const password = ref(import.meta.env.PROD ? "" : "rootroot");

const onSubmit = async () => {
  loading.value = true;
  try {
    const response = await client.post('auth/login', {
      password: password.value,
      email: email.value
    })

    setLogin(response.data.user, response.data.authorization.token)

    router.push(route.query.redirect || '/orga')
  } catch (error) {
    console.error(error)
    toast.add({ severity: 'error', summary: 'Login war nicht erfolgreich', life: 6000 });
  }
  loading.value = false;
};

</script>
<template>
  <main>
    <Toast />
    <div class="">
      <div class="">
        <h1>Login</h1>
        <form @submit.prevent="onSubmit">
          <div class="flex flex-column gap-2">
            <label for="email">E-Mail-Adresse: </label>
            <InputText v-model="email" type="email" required id="email" autofocus="true" />
          </div>
          <div class="flex flex-column gap-2 mt-2">
            <label for="password">Passwort</label>
            <InputText v-model="password" type="password" required id="password" />
          </div>
          <Button :disabled="loading" type="submit" label="Login" class="mt-3" />
        </form>
      </div>
    </div>
  </main>
</template>
