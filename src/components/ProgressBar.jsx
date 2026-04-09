export default function ProgressBar({ current, total, section }) {
  const pct = Math.round((current / total) * 100);
  const label = section === 'se' ? 'Strengths' : 'Interests';
  const part = section === 'se' ? 2 : 1;

  return (
    <div className="w-full">
      <div
        className="flex justify-between px-4 pt-3 pb-1 text-xs"
        style={{ color: '#AAAAAA' }}
      >
        <span>Part {part} of 2 — {label}</span>
        <span>{current} / {total}</span>
      </div>
      <div style={{ height: '3px', background: '#E5E5E5' }}>
        <div
          className="h-full transition-all duration-300 ease-out"
          style={{ width: `${pct}%`, background: '#5B5BD6' }}
        />
      </div>
    </div>
  );
}
