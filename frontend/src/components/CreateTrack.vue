<script setup>
import InputText from "primevue/inputtext";
import Textarea from 'primevue/textarea';
import Button from "primevue/button";
import Toast from 'primevue/toast';
import { ref } from "vue";
import { client } from "../lib/api";
import { generateKeypair } from "../lib/crypto"
import { useToast } from 'primevue/usetoast';

const emit = defineEmits(["reload-data"])

const toast = useToast();

const loading = ref(false);

const name = ref("");
const slug = ref("");
const public_key = ref("");
const private_key = ref("");

const createSlug = () => {
    slug.value = name.value.toLowerCase().replace(/ /g, "-")
}
const createKeyPair = async () => {
    console.log('test')
    const keypair = await generateKeypair()
    console.log(keypair)
    public_key.value = JSON.stringify(keypair.exportPublicKey)
    private_key.value = JSON.stringify(keypair.exportPrivateKey)
}
const onSubmit = async () => {
    loading.value = true;
    try {
        const response = await client.post('tracks', {
            name: name.value,
            slug: slug.value,
            public_key: public_key.value
        })
        console.log(response)
        toast.add({ severity: 'success', summary: 'Track wurde angelegt', life: 6000 });
        emit("reload-data");

        name.value = "";
        slug.value = "";
        public_key.value = "";
        private_key.value = "";
    } catch (error) {
        console.error(error)
        toast.add({ severity: 'error', summary: `Fehler: ${error}`, life: 6000 });
    }
    loading.value = false;
};

</script>
<template>
    <Toast />
    <h2>Neuen Track anlegen</h2>
    <form @submit.prevent="onSubmit">
        <div class="field grid">
            <label class="col-fixed">Name</label>
            <div class="col">
                <InputText v-model="name" type="text" required />
            </div>
        </div>
        <div class="field grid">
            <label class="col-fixed">Slug</label>
            <div class="col">
                <InputText v-model="slug" type="text" required />
            </div>
            <div class="col">
                <Button type="button" label="Slug generieren" @click="createSlug()" />
            </div>
        </div>
        <div>
            <div class="field grid">
                <label class="col-fixed">Public Key</label>
                <div class="col">
                    <Textarea class="w-full" v-model="public_key" type="text" required disabled />
                </div>
                <div class="col">
                    <Button type="button" label="Public Key Erstellen" @click="createKeyPair()" />
                </div>
            </div>
            <div class="field grid">
                <label class="col-fixed">Private Key</label>
                <div class="col">
                    <Textarea v-model="private_key" type="text" required disabled />
                </div>
            </div>
        </div>

        <Button :disabled="loading" type="submit" label="Anlegen" />
    </form>
</template>