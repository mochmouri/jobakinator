import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { TRAITS, TRAIT_LABELS, TRAIT_DESCRIPTIONS } from '../utils/score';

function getOrCreateSession() {
  const key = 'ja_session_id';
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

export default function SubmissionFlow({ userProfile, onBack }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  // Pre-fill sliders from user profile, clamped 0–10
  const [sliders, setSliders] = useState(() => {
    const maxVal = Math.max(...Object.values(userProfile));
    // Normalise so the max maps to 10
    const scale = maxVal > 0 ? 10 / maxVal : 1;
    return Object.fromEntries(
      TRAITS.map(t => [t, Math.round(Math.min(10, (userProfile[t] || 0) * scale))])
    );
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit() {
    setSubmitting(true);
    const sessionId = getOrCreateSession();
    const { error } = await supabase.from('profession_submissions').insert({
      suggested_name: name.trim(),
      traits: sliders,
      submitted_by_session: sessionId,
    });
    setSubmitting(false);
    if (!error) setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="animate-fade-in w-full max-w-[540px] mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-medium mb-3" style={{ color: '#1A1A1A' }}>
          Thanks for the suggestion
        </h2>
        <p className="text-sm mb-8" style={{ color: '#6B6B6B' }}>
          If others describe <em>{name}</em> similarly, it will join the pool.
        </p>
        <button
          onClick={onBack}
          className="text-sm cursor-pointer"
          style={{ background: 'none', border: 'none', color: '#5B5BD6' }}
        >
          Back to results
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in w-full max-w-[540px] mx-auto px-4 py-10">
      <button
        onClick={onBack}
        className="text-sm mb-8 cursor-pointer"
        style={{ background: 'none', border: 'none', color: '#AAAAAA', padding: 0 }}
      >
        ← Back
      </button>

      {/* Step indicators */}
      <div className="flex gap-2 mb-8">
        {[1, 2, 3].map(s => (
          <div
            key={s}
            style={{
              height: '3px',
              flex: 1,
              borderRadius: '2px',
              background: s <= step ? '#5B5BD6' : '#E5E5E5',
              transition: 'background 0.3s',
            }}
          />
        ))}
      </div>

      {step === 1 && (
        <div className="animate-fade-in">
          <h2 className="text-xl font-medium mb-2" style={{ color: '#1A1A1A' }}>
            What kind of work appeals to you?
          </h2>
          <p className="text-sm mb-6" style={{ color: '#6B6B6B' }}>
            What do you do, or what kind of role do you have in mind?
          </p>
          <input
            type="text"
            maxLength={60}
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. marine archaeologist"
            className="w-full text-sm outline-none"
            style={{
              height: '44px',
              padding: '0 12px',
              border: '1px solid #E5E5E5',
              borderRadius: '6px',
              background: '#FFFFFF',
              color: '#1A1A1A',
            }}
            onFocus={e => { e.currentTarget.style.borderColor = '#5B5BD6'; }}
            onBlur={e => { e.currentTarget.style.borderColor = '#E5E5E5'; }}
          />
          <button
            onClick={() => setStep(2)}
            disabled={!name.trim()}
            className="cursor-pointer transition-colors duration-100 mt-6"
            style={{
              height: '44px',
              width: '120px',
              background: name.trim() ? '#1A1A1A' : '#E5E5E5',
              color: name.trim() ? '#FAFAFA' : '#AAAAAA',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: name.trim() ? 'pointer' : 'not-allowed',
            }}
          >
            Next
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="animate-fade-in">
          <h2 className="text-xl font-medium mb-2" style={{ color: '#1A1A1A' }}>
            Rate yourself on each dimension
          </h2>
          <p className="text-sm mb-6" style={{ color: '#6B6B6B' }}>
            These are pre-filled from your quiz answers. Adjust anything that feels off.
          </p>
          <div className="flex flex-col gap-5">
            {TRAITS.map(trait => (
              <div key={trait}>
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-sm font-medium" style={{ color: '#1A1A1A' }}>
                    {TRAIT_LABELS[trait]}
                  </span>
                  <span className="text-sm" style={{ color: '#5B5BD6' }}>
                    {sliders[trait]}
                  </span>
                </div>
                <p className="text-xs mb-2" style={{ color: '#AAAAAA' }}>
                  {TRAIT_DESCRIPTIONS[trait]}
                </p>
                <input
                  type="range"
                  min={0}
                  max={10}
                  value={sliders[trait]}
                  onChange={e =>
                    setSliders(prev => ({ ...prev, [trait]: Number(e.target.value) }))
                  }
                  className="w-full cursor-pointer"
                  style={{ accentColor: '#5B5BD6' }}
                />
              </div>
            ))}
          </div>
          <button
            onClick={() => setStep(3)}
            className="cursor-pointer transition-colors duration-100 mt-8"
            style={{
              height: '44px',
              width: '120px',
              background: '#1A1A1A',
              color: '#FAFAFA',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
            }}
          >
            Next
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="animate-fade-in">
          <h2 className="text-xl font-medium mb-2" style={{ color: '#1A1A1A' }}>
            Confirm your submission
          </h2>
          <p className="text-sm mb-6" style={{ color: '#6B6B6B' }}>
            You&apos;re suggesting: <strong>{name}</strong>
          </p>

          {/* Trait bar chart */}
          <div className="flex flex-col gap-3 mb-8">
            {TRAITS.map(trait => (
              <div key={trait}>
                <div className="flex justify-between mb-1">
                  <span className="text-xs" style={{ color: '#6B6B6B' }}>{TRAIT_LABELS[trait]}</span>
                  <span className="text-xs" style={{ color: '#6B6B6B' }}>{sliders[trait]}/10</span>
                </div>
                <div style={{ height: '4px', background: '#E5E5E5', borderRadius: '2px' }}>
                  <div
                    className="animate-bar-grow"
                    style={{
                      height: '100%',
                      width: `${sliders[trait] * 10}%`,
                      background: '#5B5BD6',
                      borderRadius: '2px',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs mb-6" style={{ color: '#AAAAAA' }}>
            If others describe {name} similarly, it will join the career pool.
          </p>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="cursor-pointer transition-colors duration-100"
            style={{
              height: '44px',
              width: '140px',
              background: submitting ? '#E5E5E5' : '#1A1A1A',
              color: submitting ? '#AAAAAA' : '#FAFAFA',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: submitting ? 'not-allowed' : 'pointer',
            }}
          >
            {submitting ? 'Sending…' : 'Submit'}
          </button>
        </div>
      )}
    </div>
  );
}
