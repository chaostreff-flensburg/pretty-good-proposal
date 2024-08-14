<script setup>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
const props = defineProps({
    opinions: Array,
    users: Array,
});

const vote_average = +props.opinions.reduce(
    (accumulator, currentValue) => (parseFloat(accumulator) + parseFloat(currentValue.vote)).toFixed(2),
    0
) / props.opinions.length;

const table_vote_average = props.users.map((user) => {
    const userOpinions = props.opinions.filter(opinion => +opinion.user_id === +user.id).map(opinion => { return { ...opinion, vote: +opinion.vote } });
    const userOpinionsVotes = userOpinions.map(opinion => +opinion.vote);
    const vote_average = +userOpinions.reduce(
        (accumulator, currentValue) => accumulator + currentValue.vote,
        0
    ) / userOpinions.length || '0';
    return {
        username: user.username,
        vote_average: new Intl.NumberFormat('de-DE').format(vote_average),
        userOpinions: userOpinions.map(opinion => +opinion.vote).sort(),
        min: userOpinions.length ? Math.min(...userOpinionsVotes) : 'X',
        max: userOpinions.length ? Math.max(...userOpinionsVotes) : 'X'
    };
});
</script>
<template>
    <div class="m-4">
        <h2>Opinion Stats</h2>
        <p>Durchschnittswert aller Stimmen: {{ new Intl.NumberFormat('de-DE').format(vote_average) }}</p>

        <h3>Durschnittswert pro User</h3>
        <DataTable :value="table_vote_average">
            <Column field="username" header="Username" sortable></Column>
            <Column field="vote_average" header="Durchschnitt" sortable></Column>
            <Column field="min" header="Niedriegster Vote" sortable></Column>
            <Column field="max" header="Höchster Vote" sortable></Column>
            <Column field="userOpinions" header="Alle Votes" sortable></Column>
        </DataTable>
    </div>
</template>