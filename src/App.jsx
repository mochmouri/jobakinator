import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { buildProfile, rankProfessions } from './utils/score';
import rawProfessionsJson from './data/professions.json?raw';
import questions from './data/questions.json';
import rawSeQuestions from './data/selfEfficacy.json';
import Landing from './components/Landing';
import ProgressBar from './components/ProgressBar';
import Question from './components/Question';
import Result from './components/Result';
import SubmissionFlow from './components/SubmissionFlow';

// professions.json may contain // comments — strip before parsing
const fallbackProfessions = JSON.parse(
  rawProfessionsJson.split('\n').filter(l => !l.trimStart().startsWith('//')).join('\n')
);

// Expand SE questions into the same answers shape as interest questions
// so Question.jsx can render them without changes.
// Each SE question affects a single trait; scores map to delta 0 / 1 / 2.
const SE_SCALE = [
  { text: 'Not confident', score: 0 },
  { text: 'Somewhat confident', score: 1 },
  { text: 'Very confident', score: 2 },
];

const seQuestions = rawSeQuestions.map(q => ({
  ...q,
  answers: SE_SCALE.map(({ text, score }) => ({
    text,
    deltas: { [q.trait]: score },
  })),
}));

export default function App() {
  // screen: loading | landing | quiz | results | submission
  const [screen, setScreen] = useState('loading');
  // quizSection: interest | se
  const [quizSection, setQuizSection] = useState('interest');
  const [professions, setProfessions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [interestAnswers, setInterestAnswers] = useState([]);
  const [seAnswers, setSeAnswers] = useState([]);
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
    if (quizSection === 'interest') {
      const newAnswers = [...interestAnswers, answer];
      setInterestAnswers(newAnswers);

      if (currentQ + 1 < questions.length) {
        setTransitioning(true);
        setTimeout(() => {
          setCurrentQ(q => q + 1);
          setTransitioning(false);
        }, 80);
      } else {
        // Interest section done — move to SE
        setTransitioning(true);
        setTimeout(() => {
          setQuizSection('se');
          setCurrentQ(0);
          setTransitioning(false);
        }, 80);
      }
    } else {
      const newAnswers = [...seAnswers, answer];
      setSeAnswers(newAnswers);

      if (currentQ + 1 < seQuestions.length) {
        setTransitioning(true);
        setTimeout(() => {
          setCurrentQ(q => q + 1);
          setTransitioning(false);
        }, 80);
      } else {
        // Both sections done — compute results
        const profile = buildProfile(interestAnswers, newAnswers);
        const ranked = rankProfessions(profile, professions);
        setUserProfile(profile);
        setTopResults(ranked.slice(0, 3));
        setScreen('results');
      }
    }
  }

  function restart() {
    setInterestAnswers([]);
    setSeAnswers([]);
    setCurrentQ(0);
    setQuizSection('interest');
    setTopResults([]);
    setUserProfile(null);
    setScreen('landing');
  }

  function handleNoneOfThese(profile) {
    setUserProfile(profile);
    setScreen('submission');
  }

  const activeQuestions = quizSection === 'interest' ? questions : seQuestions;

  return (
    <div
      className="flex flex-col min-h-svh"
      style={{ background: '#FAFAFA' }}
    >
      {/* Progress bar — full width at top during quiz */}
      {screen === 'quiz' && !transitioning && (
        <ProgressBar
          current={currentQ + 1}
          total={activeQuestions.length}
          section={quizSection}
        />
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
            key={`${quizSection}-${currentQ}`}
            question={activeQuestions[currentQ]}
            questionNumber={currentQ + 1}
            total={activeQuestions.length}
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
