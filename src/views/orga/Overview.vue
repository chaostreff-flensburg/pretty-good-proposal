<script setup>
import dayjs from 'dayjs'
import { supabase } from '../../supabase'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast';
import { status } from '../../lib/const'
import StatusDropdown from '../../components/StatusDropdown.vue';
import ProgressSpinner from 'primevue/progressspinner';
import Toast from 'primevue/toast';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import Button from 'primevue/button';

const router = useRouter()
const loading = ref(false)
const proposals = ref([])
const toast = useToast();
const proposalStatus = ref('created')

onMounted(async () => {
    await loadPoposals()
})

const loadPoposals = async () => {
    loading.value = true
    try {
        let { data } = await supabase
            .from('proposals')
            .select(`*, opinions(*)`)
            .eq('status', proposalStatus.value)
            .order('created_at', { ascending: false })
            .throwOnError();
        data = data.map((proposal) => { return { ...proposal, status: status[proposal.status]?.name || proposal.status } })
        data = data.map((proposal) => {
            proposal.created_at = dayjs(proposal.created_at).format('DD.MM.YYYY HH:MM')
            if (proposal.opinions.length === 0) return proposal
            const vote_average = proposal.opinions.reduce(
                (accumulator, currentValue) => accumulator + currentValue.vote,
                0
            )
            const comments_count = proposal.opinions.filter((opinion) => !!opinion.comment && opinion.comment !== '').length
            const vote_count = proposal.opinions.filter((opinion) => !!opinion.vote).length
            return {
                ...proposal,
                vote_count,
                vote_average,
                comments_count
            }
        })
        proposals.value = data
    }
    catch (error) {
        console.error(error)
        toast.add({
            severity: 'warn',
            summary: 'Error',
            detail: error?.message || 'Beim laden ist ein Fehler aufgetrente',
            life: 5000
        });
    }
    finally {
        loading.value = false
    }
}
const onRowSelect = (event) => {
    console.log(event)
    const { id } = event.data
    router.push({
        name: 'proposal',
        params: {
            id
        },
    })
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
                <StatusDropdown v-model="proposalStatus" class="mr-2"/> <Button @click="loadPoposals" label="🔎 Filtern" />
            </div>
        </div>
    </div>
    <template v-if="loading">
        <ProgressSpinner />
    </template>
    <template v-else>
        <DataTable :value="proposals" stripedRows showGridlines selectionMode="single" dataKey="id"
            tableStyle="min-width: 50rem" @rowSelect="onRowSelect">
            <Column field="id" header="ID" v-tooltip="'ID wird vom System vergeben'" sortable style="width: 8%"></Column>
            <Column field="thesis_name" header="Name" sortable style="width: 60%"></Column>
            <Column field="status" header="Status" sortable style="width: 8%"></Column>
            <Column field="vote_count" v-tooltip="'Anzahl abgegebene Stimmen'" header="👥" sortable style="width: 8%">
            </Column>
            <Column field="vote_average" v-tooltip="'Durchschnittswert abgegebene Stimmen'" header="🗳️" sortable
                style="width: 8%"></Column>
            <Column field="comments_count" v-tooltip="'Anzahl Kommentare'" header="📝" sortable style="width: 8%"></Column>
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

