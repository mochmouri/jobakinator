const MEDAL = ['🥇', '🥈', '🥉'];

function MatchBar({ percentage, delay }) {
  return (
    <div className="w-full h-2 bg-slate-700/60 rounded-full overflow-hidden mt-3">
      <div
        className="h-full rounded-full animate-bar-grow"
        style={{
          width: `${percentage}%`,
          background: 'linear-gradient(90deg, #6366f1, #a855f7, #ec4899)',
          animationDelay: `${delay}ms`,
          animationDuration: '1.2s',
          animationFillMode: 'both',
        }}
      />
    </div>
  );
}

function ProfessionCard({ profession, rank, delay }) {
  const isTop = rank === 0;

  return (
    <div
      className="animate-reveal-card rounded-3xl border p-6 text-left"
      style={{
        animationDelay: `${delay}ms`,
        background: isTop
          ? 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(168,85,247,0.15))'
          : 'rgba(30,32,50,0.8)',
        borderColor: isTop ? 'rgba(168,85,247,0.5)' : 'rgba(100,116,139,0.3)',
        boxShadow: isTop ? '0 0 40px rgba(168,85,247,0.1)' : 'none',
      }}
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{profession.emoji}</span>
          <div>
            <span className="text-lg mr-2">{MEDAL[rank]}</span>
            <span className={`font-bold text-lg ${isTop ? 'text-white' : 'text-slate-200'}`}>
              {profession.title}
            </span>
          </div>
        </div>
        <div className="flex-shrink-0 text-right">
          <span
            className={`text-2xl font-black ${isTop ? 'text-purple-300' : 'text-slate-400'}`}
          >
            {profession.percentage}%
          </span>
          <p className="text-xs text-slate-500">match</p>
        </div>
      </div>

      <MatchBar percentage={profession.percentage} delay={delay + 200} />

      <p className="text-slate-400 text-sm mt-4 leading-relaxed">
        {profession.description}
      </p>

      <div className="mt-4 p-3 rounded-xl bg-slate-700/30 border border-slate-700/40">
        <p className="text-xs font-semibold text-purple-400 uppercase tracking-wide mb-1">
          Why this suits you
        </p>
        <p className="text-slate-300 text-sm leading-relaxed">{profession.whySuitsYou}</p>
      </div>
    </div>
  );
}

export default function Results({ topProfessions, onRestart }) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="animate-pop-in text-center mb-10">
        <div className="text-6xl mb-4">🎯</div>
        <h2 className="text-3xl sm:text-4xl font-black text-white mb-2">Your Top Matches</h2>
        <p className="text-slate-400 text-base">
          Based on your answers, here are the careers that fit you best.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        {topProfessions.map((prof, i) => (
          <ProfessionCard
            key={prof.id}
            profession={prof}
            rank={i}
            delay={i * 150}
          />
        ))}
      </div>

      <div className="mt-10 text-center animate-fade-slide-in" style={{ animationDelay: '600ms' }}>
        <button
          onClick={onRestart}
          className="px-8 py-3 rounded-2xl font-semibold text-white transition-all duration-200
            hover:scale-105 active:scale-95 cursor-pointer"
          style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}
        >
          Try Again
        </button>
        <p className="text-slate-500 text-xs mt-3">Your answers are not saved anywhere.</p>
      </div>
    </div>
  );
}
