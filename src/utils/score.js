export const TRAITS = [
  'analytical', 'creative', 'social', 'technical', 'physical',
  'entrepreneurial', 'structured', 'humanitarian', 'outdoors', 'leadership',
];

export const TRAIT_LABELS = {
  analytical: 'Analytical',
  creative: 'Creative',
  social: 'Social',
  technical: 'Technical',
  physical: 'Physical',
  entrepreneurial: 'Entrepreneurial',
  structured: 'Structured',
  humanitarian: 'Humanitarian',
  outdoors: 'Outdoors',
  leadership: 'Leadership',
};

export const TRAIT_DESCRIPTIONS = {
  analytical: 'You like logic, data, and figuring things out systematically',
  creative: 'You enjoy making things and thinking in new, original ways',
  social: 'You are energised by people and draw meaning from human connection',
  technical: 'You are comfortable with tools, systems, and technical complexity',
  physical: 'You like using your body and working in physical environments',
  entrepreneurial: 'You are drawn to building things, taking risks, and working independently',
  structured: 'You value order, clear processes, and doing things methodically',
  humanitarian: 'You are motivated by helping people and contributing to the common good',
  outdoors: 'You prefer working in nature or varied locations over a fixed desk',
  leadership: 'You enjoy taking charge, making decisions, and guiding others',
};

// interestAnswers: array of answer objects with .deltas (from interest MC questions)
// seAnswers: array of answer objects with .deltas (expanded from SE questions — one trait each, score 0/1/2)
export function buildProfile(interestAnswers, seAnswers) {
  // Accumulate raw interest scores
  const interest = Object.fromEntries(TRAITS.map(t => [t, 0]));
  for (const answer of interestAnswers) {
    for (const [trait, delta] of Object.entries(answer.deltas)) {
      interest[trait] += delta;
    }
  }

  // Accumulate raw SE scores (max 2 per trait — one question, score 0/1/2)
  const se = Object.fromEntries(TRAITS.map(t => [t, 0]));
  for (const answer of seAnswers) {
    for (const [trait, delta] of Object.entries(answer.deltas)) {
      se[trait] += delta;
    }
  }

  // Normalise interest by the observed max across all traits (floors at 1 to avoid ÷0)
  const interestMax = Math.max(...Object.values(interest), 1);

  // SE max is fixed at 2
  const seMax = 2;

  // Weighted combination: interest 65%, self-efficacy 35%
  const profile = Object.fromEntries(TRAITS.map(t => [t, 0]));
  for (const t of TRAITS) {
    profile[t] = (interest[t] / interestMax) * 0.65 + (se[t] / seMax) * 0.35;
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
