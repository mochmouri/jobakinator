import { useState } from 'react';

function MatchBar({ percentage, delay }) {
  return (
    <div
      className="w-full overflow-hidden"
      style={{ height: '4px', background: '#E5E5E5', borderRadius: '2px', marginTop: '6px' }}
    >
      <div
        className="h-full animate-bar-grow"
        style={{
          width: `${percentage}%`,
          background: '#5B5BD6',
          borderRadius: '2px',
          animationDelay: `${delay}ms`,
          animationDuration: '0.7s',
          animationFillMode: 'both',
        }}
      />
    </div>
  );
}

function ProfessionCard({ profession, rank, delay, onExpand, expanded }) {
  return (
    <div
      className="animate-fade-in"
      style={{
        animationDelay: `${delay}ms`,
        border: '1px solid #E5E5E5',
        borderRadius: '8px',
        padding: '20px',
        background: '#FFFFFF',
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs" style={{ color: '#AAAAAA' }}>#{rank + 1}</span>
            <span
              className="text-xs px-2 py-0.5"
              style={{
                background: '#F5F5F5',
                color: '#6B6B6B',
                borderRadius: '4px',
              }}
            >
              {profession.category}
            </span>
          </div>
          <h3 className="text-[18px] font-medium" style={{ color: '#1A1A1A' }}>
            {profession.title || profession.name}
          </h3>
        </div>
        <div className="flex-shrink-0 text-right">
          <span className="text-[22px] font-medium" style={{ color: '#5B5BD6' }}>
            {profession.percentage}%
          </span>
          <MatchBar percentage={profession.percentage} delay={delay + 150} />
        </div>
      </div>

      <p className="text-sm mt-3 leading-relaxed" style={{ color: '#6B6B6B' }}>
        {profession.description}
      </p>

      <button
        onClick={onExpand}
        className="text-sm mt-3 cursor-pointer transition-colors duration-100"
        style={{ color: expanded ? '#5B5BD6' : '#AAAAAA', background: 'none', border: 'none', padding: 0 }}
      >
        {expanded ? 'Hide details' : 'Why this fits you'}
      </button>

      {expanded && (
        <p
          className="text-sm mt-2 leading-relaxed animate-fade-in"
          style={{ color: '#6B6B6B', fontStyle: 'italic' }}
        >
          {profession.why || profession.whySuitsYou}
        </p>
      )}
    </div>
  );
}

export default function Result({ topProfessions, onRestart, onNoneOfThese, userProfile }) {
  const [expandedIdx, setExpandedIdx] = useState(null);

  function toggleExpand(idx) {
    setExpandedIdx(prev => (prev === idx ? null : idx));
  }

  return (
    <div className="animate-fade-in w-full max-w-[600px] mx-auto px-4 py-10">
      <h2 className="text-[26px] font-medium mb-1" style={{ color: '#1A1A1A' }}>
        Your top matches
      </h2>
      <p className="text-sm mb-8" style={{ color: '#6B6B6B' }}>
        Based on your answers across 10 career dimensions.
      </p>

      <div className="flex flex-col gap-4">
        {topProfessions.map((prof, i) => (
          <ProfessionCard
            key={prof.id}
            profession={prof}
            rank={i}
            delay={i * 80}
            expanded={expandedIdx === i}
            onExpand={() => toggleExpand(i)}
          />
        ))}
      </div>

      <div className="mt-10 flex flex-col items-center gap-4">
        <button
          onClick={onRestart}
          className="cursor-pointer transition-colors duration-100"
          style={{
            height: '44px',
            width: '140px',
            background: '#1A1A1A',
            color: '#FAFAFA',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#333333'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#1A1A1A'; }}
        >
          Try again
        </button>
        <button
          onClick={() => onNoneOfThese(userProfile)}
          className="text-sm cursor-pointer transition-colors duration-100"
          style={{ background: 'none', border: 'none', color: '#AAAAAA', padding: 0 }}
          onMouseEnter={e => { e.currentTarget.style.color = '#6B6B6B'; }}
          onMouseLeave={e => { e.currentTarget.style.color = '#AAAAAA'; }}
        >
          None of these fit me
        </button>
      </div>
    </div>
  );
}
