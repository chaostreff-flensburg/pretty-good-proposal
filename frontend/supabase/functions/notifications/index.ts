// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SMTPClient } from "https://deno.land/x/denomailer/mod.ts";

const supabaseClient = createClient(
  Deno.env.get("SUPABASE_URL") ?? "", // Supabase API URL - env var exported by default.
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "", // Supabase API ANON KEY - env var exported by default.
);

const templateUrlBase = "https://bewerben.ccs.chaostreff-flensburg.de";

const smtp = new SMTPClient({
  debug: {
    log: false,
  },
  connection: {
    hostname: Deno.env.get("SMTP_HOSTNAME")!,
    port: Number(Deno.env.get("SMTP_PORT")!),
    tls: true,
    auth: {
      username: Deno.env.get("SMTP_USERNAME")!,
      password: Deno.env.get("SMTP_PASSWORD")!,
    },
  },
});

const getNotificationsForProposals = async () => {
  try {
    let notifcations = [];
    const { data: proposals_new } = await supabaseClient
      .from("proposals")
      .select(
        `id, last_notification_send, thesis_name, opinions(profile_id)`,
      )
      .eq("status", "created")
      .is("last_notification_send", null)
      .throwOnError();

    const dateTime7DaysAgo = new Date(Date.now() - (7 * 24 * 60 * 60 * 1000))
      .toISOString(); // 7 Days ago
    const { data: proposals_reminder } = await supabaseClient
      .from("proposals")
      .select(
        `id, last_notification_send, thesis_name, opinions(profile_id)`,
      )
      .eq("status", "created")
      .lt("last_notification_send", dateTime7DaysAgo)
      .throwOnError();
    const { data: { users } } = await supabaseClient.auth.admin
      .listUsers();
    const proposals = [...(proposals_reminder || []), ...(proposals_new || [])];
    proposals.forEach((proposal) => {
      users.forEach((user) => {
        if (
          !proposal?.opinions?.map(({ profile_id }) => profile_id).includes(
            user.id,
          )
        ) {
          proposal = {
            ...proposal,
            thesis_name: proposal.thesis_name.replace(/[^\x00-\x7F]/g, ""),
          };
          notifcations.push({
            email_address: user.email,
            thesis_name: proposal.thesis_name,
            proposal_id: proposal.id,
            notification_type:
              (proposal.last_notification_send ? "reminder" : "created"),
          });
        }
      });
    });
    return notifcations;
  } catch (error) {
    console.error(error);
  }
};

const sendMail = async (to: string, subject: string, content: string) => {
  try {
    await smtp.send({
      from: Deno.env.get("SMTP_USERNAME")!,
      to,
      subject,
      content,
    });
  } catch (error) {
    console.error(error);
  }
};

const createMailContentSubject = (
  notification_type: string,
  proposal_id: string,
  thesis_name: string,
) => {
  return {
    subject:
      (notification_type === "created"
        ? "Es gibt eine neue Bewerbung"
        : "Erinnerung zur Bewerbung") +
      `  | CSS | ${proposal_id} "${thesis_name}"`,
    content: `Moin,
Benachrichtigung zur Bewerbung: Nr. ${proposal_id} mit dem Titel: "${thesis_name}".
${templateUrlBase}/#/proposal/${proposal_id}
Bitte gib innerhalb der nächsten 7 Tagen eine Meinung zu der Bewerbung ab. Ansonsten bekommst du eine weitere Erinnerungs E-Mail.
Vielen Dank für deine Arbeit! \o/

CCS Bewerbungsportal
${templateUrlBase}`,
  };
};

const sendMailQueue = async () => {
  try {
    const sendNotifcations = await getNotificationsForProposals();
    sendNotifcations?.forEach(
      async (
        { email_address, thesis_name, proposal_id, notification_type },
      ) => {
        const { content, subject } = createMailContentSubject(
          notification_type,
          proposal_id,
          thesis_name,
        );
        await sendMail(email_address, subject, content);
        const { data } = await supabaseClient
          .from("proposals")
          .update(
            {
              last_notification_send: new Date().toISOString(),
            },
          )
          .eq("id", proposal_id)
          .throwOnError();
      },
    );
  } catch (error) {
    console.error(error);
  }
};

serve(async () => {
  await sendMailQueue();

  return new Response(
    JSON.stringify({ success: true }),
    { headers: { "Content-Type": "application/json" } },
  );
});
