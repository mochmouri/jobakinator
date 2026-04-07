import { useState } from 'react';

export default function Question({ question, questionNumber, total, onAnswer }) {
  const [selected, setSelected] = useState(null);

  function handleSelect(answer, idx) {
    if (selected !== null) return;
    setSelected(idx);
    setTimeout(() => onAnswer(answer), 350);
  }

  return (
    <div className="animate-fade-slide-in w-full max-w-2xl mx-auto">
      <p className="text-xs font-semibold tracking-widest text-purple-400 uppercase mb-3">
        Question {questionNumber} / {total}
      </p>
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 leading-tight">
        {question.text}
      </h2>

      <div className="flex flex-col gap-3">
        {question.answers.map((answer, idx) => {
          const isSelected = selected === idx;
          const isDimmed = selected !== null && !isSelected;

          return (
            <button
              key={idx}
              onClick={() => handleSelect(answer, idx)}
              className={[
                'w-full text-left px-5 py-4 rounded-2xl border text-sm sm:text-base font-medium',
                'transition-all duration-200 cursor-pointer',
                isSelected
                  ? 'bg-purple-600 border-purple-400 text-white scale-[1.02] shadow-lg shadow-purple-900/40'
                  : isDimmed
                  ? 'bg-slate-800/30 border-slate-700/30 text-slate-500'
                  : 'bg-slate-800/60 border-slate-700 text-slate-200 hover:bg-slate-700/70 hover:border-purple-500/50 hover:text-white hover:scale-[1.01]',
              ].join(' ')}
            >
              <span className="inline-flex items-center gap-3">
                <span
                  className={[
                    'w-6 h-6 rounded-full border text-xs flex items-center justify-center flex-shrink-0 font-bold',
                    isSelected
                      ? 'bg-white text-purple-600 border-white'
                      : 'border-slate-600 text-slate-400',
                  ].join(' ')}
                >
                  {String.fromCharCode(65 + idx)}
                </span>
                {answer.text}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
