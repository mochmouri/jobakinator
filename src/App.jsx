import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { buildProfile, rankProfessions } from './utils/score';
import fallbackProfessions from './data/professions.json';
import questions from './data/questions.json';
import Landing from './components/Landing';
import ProgressBar from './components/ProgressBar';
import Question from './components/Question';
import Result from './components/Result';
import SubmissionFlow from './components/SubmissionFlow';

export default function App() {
  // screen: landing | quiz | results | submission
  const [screen, setScreen] = useState('loading');
  const [professions, setProfessions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);   // flat delta objects
  const [topResults, setTopResults] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    async function loadProfessions() {
      const { data, error } = await supabase
        .from('professions')
        .select('*')
        .eq('status', 'active');

      if (!error && data && data.length > 0) {
        // Supabase rows have `name` not `title` — normalise
        setProfessions(data.map(p => ({ ...p, title: p.name })));
      } else {
        setProfessions(fallbackProfessions);
      }
      setScreen('landing');
    }
    loadProfessions();
  }, []);

  function handleAnswer(answer) {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentQ + 1 < questions.length) {
      setTransitioning(true);
      setTimeout(() => {
        setCurrentQ(q => q + 1);
        setTransitioning(false);
      }, 80);
    } else {
      const profile = buildProfile(newAnswers);
      const ranked = rankProfessions(profile, professions);
      setUserProfile(profile);
      setTopResults(ranked.slice(0, 3));
      setScreen('results');
    }
  }

  function restart() {
    setAnswers([]);
    setCurrentQ(0);
    setTopResults([]);
    setUserProfile(null);
    setScreen('landing');
  }

  function handleNoneOfThese(profile) {
    setUserProfile(profile);
    setScreen('submission');
  }

  return (
    <div
      className="flex flex-col min-h-svh"
      style={{ background: '#FAFAFA' }}
    >
      {/* Progress bar — full width at top during quiz */}
      {screen === 'quiz' && !transitioning && (
        <ProgressBar current={currentQ + 1} total={questions.length} />
      )}

      <div className="flex-1 flex flex-col items-center justify-center">

        {screen === 'loading' && (
          <p className="text-sm" style={{ color: '#AAAAAA' }}>Loading…</p>
        )}

        {screen === 'landing' && (
          <Landing onStart={() => setScreen('quiz')} />
        )}

        {screen === 'quiz' && !transitioning && (
          <Question
            key={currentQ}
            question={questions[currentQ]}
            questionNumber={currentQ + 1}
            total={questions.length}
            onAnswer={handleAnswer}
          />
        )}

        {screen === 'results' && (
          <Result
            topProfessions={topResults}
            onRestart={restart}
            onNoneOfThese={handleNoneOfThese}
            userProfile={userProfile}
          />
        )}

        {screen === 'submission' && (
          <SubmissionFlow
            userProfile={userProfile}
            onBack={() => setScreen('results')}
          />
        )}

      </div>

      <footer
        className="text-center text-xs py-6"
        style={{ color: '#DDDDDD' }}
      >
        Job Akinator · {new Date().getFullYear()}
      </footer>
    </div>
  );
}
