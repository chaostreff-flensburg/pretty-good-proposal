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

onMounted(async () => {
  loading.value = true;
  try {
    proposalId.value = route.params.id;
    if (!proposalId.value) throw Error("Keine ID übergeben");
    let { data } = await supabase
      .from("proposals")
      .select(`*, opinions(*,profiles(*))`)
      .eq("id", proposalId.value)
      .throwOnError();
    proposal.value = data[0];
    proposal.value.proposal = JSON.parse(data[0].encrypted_proposal);
    items.value[0].label = `${data[0].id} - ${data[0].thesis_name}`;
    proposal.value.vote_average = proposal.value.opinions.reduce(
      (accumulator, currentValue) => accumulator + currentValue.vote,
      0
    );
    proposal.value.comments_count = proposal.value.opinions.filter(
      (opinion) => !!opinion.comment && opinion.comment !== ""
    ).length;
    proposal.value.vote_count = proposal.value.opinions.filter(
      (opinion) => !!opinion.vote
    ).length;
    const { data: session } = await supabase.auth.getSession();
    currentUserId.value = session.session?.user?.id;
    myOpinion.value = data[0].opinions.filter(
      (opinion) => opinion.profile_id === currentUserId.value
    )[0];
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
            <article v-for="(value, name, index) in proposal.proposal">
              <span class="font-bold"
                >{{ proposal_fields[name]?.de || name }}:
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
            <template #title
              >Status: {{ status[proposal.status]?.name || proposal.status }}
            </template>
          </Card>
        </div>
        <h3>Meinungen</h3>
        <Card>
          <template #title>Deine Meinung </template>
          <template #content>
            <OpinionForm
              v-if="proposalId"
              :proposal-id="route.params.id"
              :my-opinion="myOpinion"
              :current-user-id="currentUserId"
            />
          </template>
        </Card>

        <h4>Alle Meinungen</h4>
        <article
          v-for="opinion in proposal.opinions"
          v-if="proposal.opinions?.length > 0"
        >
          <Card>
            <template #title
              >{{ opinion.special_vote || opinion.vote }}
              {{ opinion.profiles.username }}
            </template>
            <template #content>{{ opinion.comment }}</template>
          </Card>
        </article>
        <div v-else>Sei die erste Person die eine Meinung abgibt</div>

        <h3>Status Ändern</h3>
        <ProposalStatusForm
          v-if="proposalId"
          :proposal-id="route.params.id"
          :proposal-status="proposal.status"
        />
      </div>
    </div>
  </template>
</template>
