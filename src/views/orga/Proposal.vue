<script setup>
import { supabase } from "../../supabase";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useToast } from "primevue/usetoast";
import { status, proposal_fields } from "../../lib/const";
import OpinionForm from "../../components/OpinionForm.vue";
import ProposalStatusForm from "../../components/ProposalStatusForm.vue";
import ProgressSpinner from "primevue/progressspinner";
import Toast from "primevue/toast";
import Breadcrumb from "primevue/breadcrumb";
import Card from "primevue/card";
import { getProposalById } from "../../lib/api.js";
import { useDialog } from "primevue/usedialog";
import { store } from "../../lib/store.js";
import PrivateKeyForm from "../../components/PrivateKeyForm.vue";
import lf from "localforage";

const dialog = useDialog();

const route = useRoute();
const loading = ref(false);
const proposal = ref({});
const proposalId = ref(null);
const myOpinion = ref(null);
const currentUserId = ref(null);
const toast = useToast();
const home = ref({
  label: "Bewerbungen Übersicht",
  to: "/orga",
});
const items = ref([{ label: "Computer" }]);

const getPrivateKey = () => new Promise((resolve, reject) => {
  dialog.open(PrivateKeyForm, {
    onClose: ({ data = null }) => {
      if (data?.privateKey) resolve(JSON.parse(data.privateKey));
      else reject("no private key");
    },
  })
});

onMounted(async () => {
  loading.value = true;
  try {
    proposalId.value = route.params.id;
    if (!proposalId.value) throw Error("Keine ID übergeben");

    const {
      data: { session = null },
    } = await supabase.auth.getSession();
    currentUserId.value = session?.user?.id;

    if (!store.encryption.privateKey) {
      const privateKey = await getPrivateKey();
      lf.setItem("encryption.privateKey", privateKey);
      store.encryption.privateKey = privateKey;
    }

    proposal.value = await getProposalById(proposalId.value);
    items.value[0].label = `${proposal.value.id} - ${proposal.value.thesis_name}`;

    myOpinion.value = proposal.value.opinions.find(
      (opinion) => opinion.profile_id === currentUserId.value
    );
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
  <template v-if="loading">
    <ProgressSpinner />
  </template>
  <template v-else>
    <Breadcrumb :home="home" :model="items" />
    <div class="grid">
      <div class="col">
        <Card>
          <template #title>Bewerbung</template>
          <template #content>
            <article v-for="(value, name) in proposal.data" :key="name">
              <span class="font-bold">{{ proposal_fields[name]?.de || name }}:
              </span>
              <span>{{ value }}</span>
            </article>
          </template>
        </Card>
      </div>
      <div class="col">
        <div class="flex">
          <Card style="max-width: 60px; max-height: 120px">
            <template #title>🗳️ {{ proposal.vote_average }} </template>
          </Card>
          <Card style="max-width: 60px; max-height: 120px">
            <template #title>👥 {{ proposal.vote_count }} </template>
          </Card>
          <Card style="max-width: 60px; max-height: 120px">
            <template #title>📝 {{ proposal.comments_count }} </template>
          </Card>
          <Card style="max-width: 240px; max-height: 120px">
            <template #title>Status: {{ status[proposal.status]?.name || proposal.status }}
            </template>
          </Card>
        </div>
        <h3>Meinungen</h3>
        <Card>
          <template #title>Deine Meinung </template>
          <template #content>
            <OpinionForm v-if="proposalId" :proposal-id="route.params.id" :my-opinion="myOpinion"
              :current-user-id="currentUserId" />
          </template>
        </Card>

        <h4>Alle Meinungen</h4>
        <article v-for="opinion in proposal.opinions" v-if="proposal.opinions?.length > 0">
          <Card>
            <template #title>{{ opinion.special_vote || opinion.vote }}
              {{ opinion.profiles.username }}
            </template>
            <template #content>{{ opinion.comment }}</template>
          </Card>
        </article>
        <div v-else>Sei die erste Person die eine Meinung abgibt</div>

        <h3>Status Ändern</h3>
        <ProposalStatusForm v-if="proposalId" :proposal-id="route.params.id" :proposal-status="proposal.status" />
      </div>
    </div>
  </template>
</template>
