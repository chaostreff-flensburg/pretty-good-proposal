const proposal_fields = {
    username: {
        de: 'Name'
    },
    pronoun: {
        de: 'Pronomen'
    },
    email: {
        de: 'E-Mail-Adresse'
    },
    phonenumber: {
        de: 'Telefonnummer'
    },
    hochschule: {
        de: 'Hochschule/Universität'
    },
    startdate: {
        de: '(geplantes) Startdatum'
    },
    thesisName: {
        de: 'Titel der Masterarbeit'
    },
    institutProfessor: {
        de: 'Institut/Professur'
    },
    thesisTask: {
        de: 'Wie ist die Aufgabenstellung deiner Arbeit?'
    },
    reasonApplicationThesis: {
        de: 'Warum passt deine Arbeit ins Thema?'
    },
    reasonApplicationPerson: {
        de: 'Erzähl uns etwas über dich?'
    }
}

const status = {
    created: {
        name: '📭 Angelegt',
        description: 'Die Bewerbung ist aktiv'
    },
    accepted: {
        name: '✅ Angenommen',
        description: 'Die Bewerbung ist angenommen'
    },
    rejected: {
        name: '❌ Abeglehnt',
        description: 'Die Bewerbung ist abgelehnt'
    }
}

export {
    proposal_fields,
    status
}