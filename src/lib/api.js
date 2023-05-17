import { supabase } from "../supabase.js";
import { fromProposal } from "./structs.js";
import { decryptProposalData, encryptProposalData } from "./crypto.js";

const createProposal = async (proposalData) => {
  const { encryptedData, encryptedSymatricKey } = await encryptProposalData(
    proposalData
  );
  await supabase
    .from("proposals")
    .insert({
      thesis_name: proposalData.thesisName,
      encrypted_data: encryptedData,
      encrypted_symatric_key: encryptedSymatricKey,
      status: "created", // TODO: Not filled from frontend?
      track: "2023.winter",
    })
    .throwOnError();
};

const getProposalById = async (id) => {
  const {
    data: [encryptedProposal],
  } = await supabase
    .from("proposals")
    .select(`*, opinions(*,profiles(*))`)
    .eq("id", id)
    .throwOnError();

  const { proposalData } = await decryptProposalData(
    encryptedProposal.encrypted_data,
    encryptedProposal.encrypted_symatric_key
  );

  return fromProposal({
    ...encryptedProposal,
    data: proposalData,
  });
};

export { createProposal, getProposalById };
