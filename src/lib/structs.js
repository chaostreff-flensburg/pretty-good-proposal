export const fromProposal = (raw) => ({
  ...raw,
  label: `${raw.id} - ${raw.thesis_name}`,
  vote_average: raw.opinions.reduce(
    (accumulator, currentValue) => accumulator + currentValue.vote,
    0
  ),
  comments_count: raw.opinions.filter(
    (opinion) => !!opinion.comment && opinion.comment !== ""
  ).length,
  vote_count: raw.opinions.filter((opinion) => !!opinion.vote).length,
});
