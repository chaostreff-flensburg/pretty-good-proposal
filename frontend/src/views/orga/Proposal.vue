<script setup>
import { onMounted, ref } from "vue";
import { getProposalById, user } from "../../lib/api";
import { proposals } from '../../proposals/index.js'
import { useRoute } from "vue-router";
import { useToast } from "primevue/usetoast";
import { status } from "../../lib/const";
import OpinionForm from "../../components/OpinionForm.vue";
import ProposalStatusForm from "../../components/ProposalStatusForm.vue";
import ProgressSpinner from "primevue/progressspinner";
import Toast from "primevue/toast";
import Breadcrumb from "primevue/breadcrumb";
import Card from "primevue/card";
import { useDialog } from "primevue/usedialog";
import PrivateKeyForm from "../../components/PrivateKeyForm.vue";
import lf from "localforage";
import EasyProposalCommunication from "../../components/EasyProposalCommunication.vue";

const dialog = useDialog();

const route = useRoute();
const loading = ref(false);
const proposal = ref({});
const proposalId = ref(null);
const myOpinion = ref(null);
const currentUserId = ref(null);
const toast = useToast();
const home = ref({
  label: "Übersicht",
  route: "/orga",
});
const items = ref([]);
const proposalData = ref(null);

const getPrivateKey = () => new Promise((resolve, reject) => {
  dialog.open(PrivateKeyForm, {
    onClose: ({ data = null }) => {
      if (data?.privateKey) resolve(JSON.parse(data.privateKey));
      else reject("Kein Private Key Vorhanden");
    },
  })
});

onMounted(async () => {
  loading.value = true;
  try {
    proposalId.value = route.params.id;
    if (!proposalId.value) throw Error("Keine ID übergeben");

    currentUserId.value = user.value.id

    const storeEncryptionKey = await lf.getItem("encryption.privateKey")
    if (!storeEncryptionKey) {
      const privateKey = await getPrivateKey();
      lf.setItem("encryption.privateKey", privateKey);
    }

    proposal.value = await getProposalById(proposalId.value);
    items.value.push({
      label: proposal.value.track.name,
      route: `/orga/track/${proposal.value.track.slug}`
    }, {
      label: proposal.value.name,
      route: `/proposal/${proposal.value.id}`
    })

    proposalData.value = proposals[proposal.value.track.slug];

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
const fieldName = (name) => {
  if (!proposalData.value) return name
  const field = proposalData.value.fields.find((data) => data.key === name);
  return field?.label.de || name;
};
</script>

<template>
  <Toast />
  <template v-if="loading">
    <ProgressSpinner />
  </template>
  <template v-else>
    <Breadcrumb :home="home" :model="items">
      <template #item="{ item, props }">
        <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
          <a :href="href" v-bind="props.action" @click="navigate">
            <span class="text-primary font-semibold">{{ item.label }}</span>
          </a>
        </router-link>
      </template>
    </Breadcrumb>
    <div class="grid">
      <div class="col">
        <Card>
          <template #title>Bewerbung</template>
          <template #content>
            <article v-for="(value, name) in proposal.data" :key="name">
              <div class="font-bold w-full">
                {{ fieldName(name) || name }}:
              </div>
              <span style="white-space: pre-wrap">{{ value }}</span>
            </article>
          </template>
        </Card>
        <hr />
        <EasyProposalCommunication v-if="proposal.status != 'created'" :proposal="proposal" />
      </div>
      <div class="col">
        <div class="flex mt-1">
          <Card class="mr-1" style="max-width: 60px; max-height: 120px">
            <template #content>🗳️ {{ proposal.vote_average }} </template>
          </Card>
          <Card class="mr-1" style="max-width: 60px; max-height: 120px">
            <template #content>👥 {{ proposal.vote_count }} </template>
          </Card>
          <Card class="mr-1" style="max-width: 60px; max-height: 120px">
            <template #content>📝 {{ proposal.comments_count }} </template>
          </Card>
          <Card style="max-width: 240px; max-height: 120px">
            <template #content>Status: {{ status[proposal.status]?.name || proposal.status }}
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
          <Card class="mt-1">
            <template #title>{{ opinion.special_vote || opinion.vote }}
              {{ opinion.user?.username }}
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
