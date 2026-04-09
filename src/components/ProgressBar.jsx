export default function ProgressBar({ current, total }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="w-full" style={{ height: '3px', background: '#E5E5E5' }}>
      <div
        className="h-full transition-all duration-300 ease-out"
        style={{ width: `${pct}%`, background: '#5B5BD6' }}
      />
    </div>
  );
}
