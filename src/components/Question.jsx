import { useState } from 'react';

export default function Question({ question, questionNumber, total, onAnswer }) {
  const [selected, setSelected] = useState(null);

  function handleSelect(answer, idx) {
    if (selected !== null) return;
    setSelected(idx);
    setTimeout(() => onAnswer(answer), 300);
  }

  return (
    <div className="animate-fade-in w-full max-w-[540px] mx-auto px-4">
      <p className="text-sm mb-5" style={{ color: '#6B6B6B' }}>
        Question {questionNumber} of {total}
      </p>
      <h2
        className="text-[22px] font-medium leading-snug mb-6"
        style={{ color: '#1A1A1A' }}
      >
        {question.text}
      </h2>

      <div className="flex flex-col gap-2">
        {question.answers.map((answer, idx) => {
          const isSelected = selected === idx;
          const isDimmed = selected !== null && !isSelected;

          return (
            <button
              key={idx}
              onClick={() => handleSelect(answer, idx)}
              disabled={selected !== null}
              className="w-full text-left text-sm transition-colors duration-100 cursor-pointer disabled:cursor-default"
              style={{
                padding: '14px 16px',
                minHeight: '48px',
                border: isSelected ? '1px solid #5B5BD6' : '1px solid #E5E5E5',
                borderRadius: '6px',
                background: isSelected
                  ? '#F4F4FF'
                  : isDimmed
                  ? '#FAFAFA'
                  : '#FFFFFF',
                color: isDimmed ? '#AAAAAA' : '#1A1A1A',
              }}
              onMouseEnter={e => {
                if (selected !== null) return;
                e.currentTarget.style.background = '#F5F5F5';
              }}
              onMouseLeave={e => {
                if (selected !== null) return;
                e.currentTarget.style.background = '#FFFFFF';
              }}
            >
              {answer.text}
            </button>
          );
        })}
      </div>
    </div>
  );
}
