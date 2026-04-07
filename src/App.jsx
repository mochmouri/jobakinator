import { useState, useEffect } from 'react';
import ProgressBar from './components/ProgressBar';
import Question from './components/Question';
import Results from './components/Results';
import { buildProfile, rankProfessions } from './utils/score';

const BASE = import.meta.env.BASE_URL;

async function loadJSON(path) {
  const res = await fetch(`${BASE}${path}`);
  return res.json();
}

export default function App() {
  const [screen, setScreen] = useState('loading'); // loading | intro | quiz | results
  const [questions, setQuestions] = useState([]);
  const [professions, setProfessions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [topResults, setTopResults] = useState([]);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    Promise.all([loadJSON('data/questions.json'), loadJSON('data/professions.json')])
      .then(([q, p]) => {
        setQuestions(q);
        setProfessions(p);
        setScreen('intro');
      })
      .catch(() => setScreen('error'));
  }, []);

  function handleAnswer(answer) {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentQ + 1 < questions.length) {
      setTransitioning(true);
      setTimeout(() => {
        setCurrentQ(q => q + 1);
        setTransitioning(false);
      }, 100);
    } else {
      const profile = buildProfile(newAnswers);
      const ranked = rankProfessions(profile, professions);
      setTopResults(ranked.slice(0, 3));
      setScreen('results');
    }
  }

  function restart() {
    setAnswers([]);
    setCurrentQ(0);
    setTopResults([]);
    setScreen('intro');
  }

  return (
    <div className="flex flex-col min-h-svh px-4 py-10 sm:py-16">
      <div className="flex-1 flex flex-col items-center justify-center">

        {screen === 'loading' && (
          <div className="text-slate-400 animate-pulse text-lg">Loading…</div>
        )}

        {screen === 'error' && (
          <div className="text-red-400">Failed to load data. Check the console.</div>
        )}

        {screen === 'intro' && (
          <div className="animate-fade-slide-in text-center max-w-xl mx-auto">
            <div className="text-7xl mb-6 animate-pop-in">🔮</div>
            <h1
              className="text-4xl sm:text-5xl font-black mb-4 leading-tight"
              style={{
                background: 'linear-gradient(135deg, #818cf8, #a855f7, #ec4899)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Job Akinator
            </h1>
            <p className="text-slate-400 text-base sm:text-lg leading-relaxed mb-8">
              Answer 12 quick questions and discover which of 20 careers suits
              you best. No sign-up. No fluff.
            </p>
            <button
              onClick={() => setScreen('quiz')}
              className="px-10 py-4 rounded-2xl text-white font-bold text-lg
                transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer
                shadow-lg shadow-purple-900/40"
              style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7, #ec4899)' }}
            >
              Start →
            </button>
            <p className="text-slate-600 text-xs mt-4">Takes about 2 minutes</p>
          </div>
        )}

        {screen === 'quiz' && !transitioning && questions.length > 0 && (
          <div className="w-full max-w-2xl mx-auto">
            <ProgressBar current={currentQ + 1} total={questions.length} />
            <Question
              key={currentQ}
              question={questions[currentQ]}
              questionNumber={currentQ + 1}
              total={questions.length}
              onAnswer={handleAnswer}
            />
          </div>
        )}

        {screen === 'results' && (
          <Results topProfessions={topResults} onRestart={restart} />
        )}

      </div>

      <footer className="text-center text-slate-700 text-xs mt-12">
        Job Akinator · {new Date().getFullYear()}
      </footer>
    </div>
  );
}
