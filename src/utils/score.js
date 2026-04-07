const TRAITS = ['creative', 'analytical', 'social', 'technical', 'physical', 'entrepreneurial'];

export function buildProfile(answers) {
  const profile = Object.fromEntries(TRAITS.map(t => [t, 0]));
  for (const answer of answers) {
    for (const [trait, delta] of Object.entries(answer.deltas)) {
      profile[trait] = (profile[trait] || 0) + delta;
    }
  }
  return profile;
}

function dotProduct(a, b) {
  return TRAITS.reduce((sum, t) => sum + (a[t] || 0) * (b[t] || 0), 0);
}

function magnitude(v) {
  return Math.sqrt(TRAITS.reduce((sum, t) => sum + (v[t] || 0) ** 2, 0));
}

export function rankProfessions(profile, professions) {
  const profileMag = magnitude(profile);

  return professions
    .map(prof => {
      const traits = prof.traits;
      const dot = dotProduct(profile, traits);
      const mag = magnitude(traits);
      const similarity = profileMag > 0 && mag > 0 ? dot / (profileMag * mag) : 0;
      const percentage = Math.round(similarity * 100);
      return { ...prof, percentage };
    })
    .sort((a, b) => b.percentage - a.percentage);
}
