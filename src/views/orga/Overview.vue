<script setup>
import dayjs from "dayjs";
import { supabase } from "../../supabase";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import { status } from "../../lib/const";
import StatusDropdown from "../../components/StatusDropdown.vue";
import ProgressSpinner from "primevue/progressspinner";
import Toast from "primevue/toast";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Accordion from "primevue/accordion";
import AccordionTab from "primevue/accordiontab";
import Button from "primevue/button";

const router = useRouter();
const loading = ref(false);
const proposals = ref([]);
const toast = useToast();
const proposalStatus = ref("created");

onMounted(async () => {
  await loadPoposals();
});

const loadPoposals = async () => {
  loading.value = true;
  try {
    let { data } = await supabase
      .from("proposals")
      .select(`*, opinions(*)`)
      .eq("status", proposalStatus.value)
      .order("created_at", { ascending: false })
      .throwOnError();
    data = data.map((proposal) => {
      return {
        ...proposal,
        status: status[proposal.status]?.name || proposal.status,
      };
    });
    const {
      data: { session = null },
    } = await supabase.auth.getSession();
    data = data.map((proposal) => {
      proposal.created_at = dayjs(proposal.created_at).format(
        "DD.MM.YYYY HH:MM"
      );
      const vote_average = proposal.opinions.reduce(
        (accumulator, currentValue) => accumulator + currentValue.vote,
        0
      );
      const comments_count = proposal.opinions.filter(
        (opinion) => !!opinion.comment && opinion.comment !== ""
      ).length;
      const vote_count = proposal.opinions.filter(
        (opinion) => !!opinion.vote
      ).length;
      //----------
      const max_vote_count = 6 // TODO: Other way: config or derived from list of voting users
      let vote_status = 'vote_completed'
      if (vote_count !== max_vote_count) {
        if (proposal.opinions.find(
          (opinion) => opinion.profile_id === session?.user?.id
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
    <div class="col mt-1 mb-2">
      Legende: <span class="bg-red-200 m-1">Rot: Du musst noch abstimmen</span>
      <span class="bg-blue-200 m-1">Blau: Andere müssen noch abstimmen</span>
      <span class="bg-green-200 m-1">Grün: Alle haben abgestimmt</span>
    </div>
  </div>
  <template v-if="loading">
    <ProgressSpinner />
  </template>
  <template v-else>
    <DataTable :value="proposals" :rowClass="rowClass" striped-rows show-gridlines selection-mode="single" data-key="id"
      table-style="min-width: 50rem" @rowSelect="onRowSelect">
      <Column v-tooltip="'ID wird vom System vergeben'" field="id" header="ID" sortable style="width: 8%"></Column>
      <Column field="thesis_name" header="Name" sortable style="width: 60%"></Column>
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
  </template>
</template>
