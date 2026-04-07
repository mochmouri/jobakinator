export default function ProgressBar({ current, total }) {
  const pct = Math.round((current / total) * 100);

  return (
    <div className="w-full mb-8">
      <div className="flex justify-between text-xs text-slate-400 mb-2 font-medium tracking-wide">
        <span>Question {current} of {total}</span>
        <span>{pct}%</span>
      </div>
      <div className="w-full h-2 bg-slate-700/60 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full animate-bar-grow"
          style={{
            width: `${pct}%`,
            background: 'linear-gradient(90deg, #6366f1, #a855f7, #ec4899)',
            transition: 'width 0.4s ease',
          }}
        />
      </div>
    </div>
  );
}
