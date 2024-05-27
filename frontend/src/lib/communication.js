export const newProposalStatusEmailTemplate = {
    generalFooter: `
    
    Viele Grüße / Best Regards
    Samuel Brinkmann
    Chaotischer Catalysator Stipendien Beirat / Chaotischer Catalysator Scholarship Advisory Board

    Chaostreff Flensburg e. V.
    Apenrader Str. 49
    24939 Flensburg
    `,
    de: {
        subject: 'Deine bewerbung für das "Chaotischer Catalysator Stipendien" hat einen neuen Status',
        rejected: {
            body: `Moin,
            vielen Dank für deine Bewerbung.\n
            Wir als Beirat haben uns entschieden, deine Masterarbeit nicht zu fördern.\n
            Wir wünschen dir dennoch viel Erfolg mit deiner Arbeit!
            Wenn du Interesse hast, deine Arbeit im Umfeld des Chaos Computer Clubs zu veröffentlichen, kannst du dich gerne bei uns melden.\n
            `
        },
        accepted: {
            body: `Moin,
            Danke für deine Bewerbung. Wir haben uns entscheiden, deine Arbeit mit einem Chaotischer Catalysator Stipendium zu fördern!
            
            Im Anhang findest du den Fördervertrag. Die nächsten Schritte sind:
            - lies den Fördervertrag sorgfältig durch, wenn du Fragen hast, schick uns eine E-Mail
            - bitte fülle die leer stellen bei Adresse und IBAN aus
            - schick uns den ausgefüllten Fördervertrag zusammen mit der Immatrikulationsbescheinigung zurück
            
            Wenn du sonst noch fragen hast, immer her damit.
            
            Ansonsten wünschen wir dir viel Erfolg bei deiner Arbeit!`
        }
    },
    en: {
        subject: 'Your application for the "Chaotic Catalyst Scholarship" has a new status',
        rejected: {
            body: `Moin,
            Thank you for your application.
            
            We as the advisory board have decided not to support your Master's thesis.
            
            Nevertheless, we wish you every success with your work!
            If you are interested in publishing your work in the environment of the Chaos Computer Club, you are welcome to contact us.
            `
        },
        accepted: {
            body: `Hello,
            Thank you for your application. We have decided to support your work with a Chaotic Catalyst Scholarship!
            
            Please find attached the grant agreement. The next steps are:
            - read the grant agreement carefully, if you have any questions, send us an email.
            - please fill in the empty fields for address and IBAN
            - Send us the completed sponsorship contract together with your certificate of enrolment.
            
            If you have any other questions, please don't hesitate to ask.
            
            Otherwise, we wish you every success with your work!`
        }
    }
}