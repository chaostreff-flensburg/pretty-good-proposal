<script setup>
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { client, setLogin } from "../lib/api";


const router = useRouter();
const route = useRoute();

const loading = ref(false);
const email = ref("root@chaostreff-flensburg.de");
const password = ref("password");

const onSubmit = async () => {
  loading.value = true;
  try {
    const response = await client.post('auth/login', {
      password: password.value,
      email: email.value
    })

    setLogin(response.data.user, response.data.authorization.token)

    const response2 = await client.get('tracks', {
      password: password.value,
      email: email.value
    })
    router.push('/orga')
    console.log(response2)
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
          <div class="field">
            <label>E-Mail-Adresse</label>
            <InputText v-model="email" type="email" required />
          </div>
          <div class="field">
            <label>Passwort</label>
            <InputText v-model="password" type="password" required />
          </div>
          <Button :disabled="loading" type="submit" label="Login" />
        </form>
      </div>
    </div>
  </main>
</template>
