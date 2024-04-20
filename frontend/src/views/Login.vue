<script setup>
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { client, setLogin } from "../lib/api";


const router = useRouter();

const loading = ref(false);
const email = ref(import.meta.env.PROD ? "" : "root@chaostreff-flensburg.de");
const password = ref(import.meta.env.PROD ? "" : "password");

const onSubmit = async () => {
  loading.value = true;
  try {
    const response = await client.post('auth/login', {
      password: password.value,
      email: email.value
    })

    setLogin(response.data.user, response.data.authorization.token)

    router.push('/orga')
  } catch (error) {
    console.error(error)
  }
  loading.value = false;
};

</script>
<template>
  <main>
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
