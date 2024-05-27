export const fromProposal = (raw) => ({
  ...raw,
  label: `${raw.id} - ${raw.thesis_name}`,
  vote_average: raw.opinions.reduce(
    (accumulator, currentValue) => (parseFloat(accumulator) + parseFloat(currentValue.vote)).toFixed(2),
    0
  ),
  comments_count: raw.opinions.filter(
    (opinion) => !!opinion.comment && opinion.comment !== ""
  ).length,
  vote_count: raw.opinions.filter((opinion) => opinion.vote !== null).length,
});
