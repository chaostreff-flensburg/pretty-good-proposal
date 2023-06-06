<script setup>
import { ref } from "vue";
import { supabase } from "../supabase";
import Toast from "primevue/toast";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import { useToast } from "primevue/usetoast";

const { authModus } = defineProps({
    authModus: {
        type: String,
        default: 'login'
    }
});

const loading = ref(false);
const email = ref("");
const toast = useToast();

const handleLogin = async () => {
    try {
        loading.value = true;
        const { error } = await supabase.auth.signInWithOtp({
            email: email.value,
            options: {
                emailRedirectTo: (import.meta.env.DEV ? "http://localhost:5173/#/login?" : "https://bewerben.ccs.chaostreff-flensburg.de/#/login?"),
                shouldCreateUser: (authModus === 'login' ? false : true),
            },
        });
        if (error) throw error;
        toast.add({
            severity: "success",
            summary: "📨",
            detail: "Prüfen Sie Ihre E-Mail auf den Anmeldelink!",
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
    <InputText v-model="email" type="email" />
    <Button :label="(authModus === 'login' ? 'Jetzt Anmelden' : 'Nutzer*in regestrieren')" @click="handleLogin" />
</template>
