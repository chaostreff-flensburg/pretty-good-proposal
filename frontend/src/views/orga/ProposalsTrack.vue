<script setup>
import dayjs from "dayjs";
import { onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useToast } from "primevue/usetoast";
import { status } from "../../lib/const";
import { client, user } from "../../lib/api";
import StatusDropdown from "../../components/StatusDropdown.vue";
import ProgressSpinner from "primevue/progressspinner";
import Toast from "primevue/toast";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Accordion from "primevue/accordion";
import AccordionTab from "primevue/accordiontab";
import Button from "primevue/button";

const router = useRouter();
const route = useRoute();
const loading = ref(false);
const proposals = ref([]);
const toast = useToast();
const proposalStatus = ref("created");
const trackUsers = ref([]);

onMounted(async () => {
  await loadPoposals();
});

const loadPoposals = async () => {
  loading.value = true;
  try {

    const response = await client.get(`track/proposals?slug=${route.params.slug}&proposalStatus=${proposalStatus.value}`)
    let data = response.data.proposals
    trackUsers.value = response.data.users

    data = data.map((proposal) => {
      return {
        ...proposal,
        status: status[proposal.status]?.name || proposal.status,
      };
    });

    data = data.map((proposal) => {
      proposal.created_at = dayjs(proposal.created_at).format(
        "DD.MM.YYYY HH:MM"
      );
      const vote_average = proposal.opinions.reduce(
        (accumulator, currentValue) => (parseFloat(accumulator) + parseFloat(currentValue.vote)).toFixed(2),
        0
      );
      const comments_count = proposal.opinions.filter(
        (opinion) => !!opinion.comment && opinion.comment !== ""
      ).length;
      const vote_count = proposal.opinions.filter(
        (opinion) => opinion.vote !== null
      ).length;
      //----------
      const max_vote_count = trackUsers.value.length
      let vote_status = 'vote_completed'
      if (vote_count !== max_vote_count) {
        if (proposal.opinions.find(
          (opinion) => opinion.user_id === user.value.id
        )) {
          vote_status = 'others_need_to_vote'
        } else {
          vote_status = 'user_need_to_vote'
        }
      }
      return {
        ...proposal,
        vote_count,
        vote_average,
        comments_count,
        vote_status
      };
    });
    proposals.value = data;
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
};
const exportTrackData = async () => {
  loading.value = true;
  try {
    const response = await client.get(`track/export/?slug=${route.params.slug}`)
    const data = JSON.stringify({ track: response.data })
    const name = `${+new Date()}-${route.params.slug}.json`
    const a = document.createElement('a');
    const type = name.split(".").pop();
    a.href = URL.createObjectURL(new Blob([data], { type: `text/${type === "txt" ? "plain" : type}` }));
    a.download = name;
    a.click();
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
};
const onRowSelect = (event) => {
  console.log(event);
  const { id } = event.data;
  router.push({
    name: "proposal",
    params: {
      id,
    },
  });
};
const rowClass = (data) => {
  return [
    { 'bg-red-200': data.vote_status === 'user_need_to_vote' },
    { 'bg-blue-200': data.vote_status === 'others_need_to_vote' },
    { 'bg-green-200': data.vote_status === 'vote_completed' }
  ];
};
</script>
<template>
  <Toast />
  <div class="grid">
    <div class="col">
      <h1>Orga - Overview</h1>
    </div>
    <div class="col">
      <div class="flex justify-content-end m-1">
        <StatusDropdown v-model="proposalStatus" class="mr-2" />
        <Button label="🔎 Filtern" @click="loadPoposals" />
      </div>
    </div>
  </div>
  <div class="grid">
    <div class="col-12 mt-1">
      Legende: <span class="bg-red-200 m-1 p-1">Rot: Du musst noch abstimmen</span>
      <span class="bg-blue-200 m-1 p-1">Blau: Andere müssen noch abstimmen</span>
      <span class="bg-green-200 m-1 p-1">Grün: Alle haben abgestimmt</span>
      <span>Anzahl angezeigter Bewerbungen {{ proposals.length }}</span>
    </div>
    <div class="col-12 mb-2">
      👥 = Anzahl abgegebene Stimmen |
      🗳️ = zusammengezählte stimmen |
      📝 = Anzahl Kommentare
    </div>
  </div>
  <template v-if="loading">
    <ProgressSpinner />
  </template>
  <template v-else>
    <DataTable :value="proposals" :rowClass="rowClass" striped-rows show-gridlines selection-mode="single" data-key="id"
      table-style="min-width: 50rem" @rowSelect="onRowSelect">
      <template #empty> Keine Bewerbungen mit diesem Filter gefunden. </template>
      <Column v-tooltip="'ID wird vom System vergeben'" field="id" header="ID" sortable style="width: 8%"></Column>
      <Column field="name" header="Name" sortable style="width: 60%"></Column>
      <Column field="status" header="Status" sortable style="width: 8%"></Column>
      <Column v-tooltip="'Anzahl abgegebene Stimmen'" field="vote_count" header="👥" sortable style="width: 8%">
      </Column>
      <Column v-tooltip="'Durchschnittswert abgegebene Stimmen'" field="vote_average" header="🗳️" sortable
        style="width: 8%"></Column>
      <Column v-tooltip="'Anzahl Kommentare'" field="comments_count" header="📝" sortable style="width: 8%"></Column>
      <Column field="created_at" header="🕰️" sortable style="width: 8%"></Column>
    </DataTable>
    <Accordion class="mt-2">
      <AccordionTab header="🤓 Entwickly Informationen">
        <pre>
                    {{ proposals }}
                </pre>
      </AccordionTab>
    </Accordion>
    <section>
      <p>
        Benutzer in diesem Track:
      </p><span v-for="user in trackUsers" :key="user.id">{{ user.username }}, </span>
    </section>

    <Button label="💾 Alle Track Daten Exportieren" @click="exportTrackData" />
  </template>
</template>
