export default function Landing({ onStart }) {
  return (
    <div className="animate-fade-in flex flex-col items-center justify-center text-center px-4 py-16 flex-1">
      <h1
        className="text-[32px] font-medium leading-tight mb-3"
        style={{ color: '#1A1A1A' }}
      >
        What career suits you?
      </h1>
      <p className="text-base mb-10" style={{ color: '#6B6B6B' }}>
        16 questions. Honest answers. No fluff.
      </p>
      <button
        onClick={onStart}
        className="cursor-pointer transition-colors duration-150"
        style={{
          height: '44px',
          width: '160px',
          border: '1px solid #1A1A1A',
          borderRadius: '6px',
          background: 'transparent',
          color: '#1A1A1A',
          fontSize: '14px',
          fontWeight: '500',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = '#1A1A1A';
          e.currentTarget.style.color = '#FAFAFA';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color = '#1A1A1A';
        }}
      >
        Start
      </button>
      <p className="text-xs mt-4" style={{ color: '#AAAAAA' }}>
        Matches across 75 careers
      </p>
    </div>
  );
}
