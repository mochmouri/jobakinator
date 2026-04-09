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

export function buildProfile(answers, questions) {
  const profile = Object.fromEntries(TRAITS.map(t => [t, 0]));

  // If called with flat delta objects (legacy), use directly
  if (!questions) {
    for (const answer of answers) {
      for (const [trait, delta] of Object.entries(answer.deltas)) {
        profile[trait] = (profile[trait] || 0) + delta;
      }
    }
    return profile;
  }

  // answers is array of { questionId, answerIndex }
  for (const { questionId, answerIndex } of answers) {
    const q = questions.find(q => q.id === questionId);
    if (!q) continue;
    const answer = q.answers[answerIndex];
    if (!answer) continue;
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
