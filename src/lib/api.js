import { supabase } from "../supabase";

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
  const proposal = {
    ...encryptedProposal,
    data: proposalData,
  };

  return proposal;
};

export { createProposal, getProposalById };
