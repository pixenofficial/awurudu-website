import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Timer, RefreshCw, Play, CheckCircle2, XCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useLanguage } from '../../lib/LanguageContext';

interface Question {
  id: string;
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correct_answer: number;
}

export default function Quiz() {
  const { t } = useLanguage();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [gameStatus, setGameStatus] = useState<'loading' | 'idle' | 'playing' | 'finished'>('loading');

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (gameStatus === 'playing' && timeLeft > 0 && selectedOption === null) {
      const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && selectedOption === null) {
      handleOptionClick(-1); // Time out
    }
  }, [gameStatus, timeLeft, selectedOption]);

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('quiz_questions')
        .select('*')
        .limit(10);
      if (error) throw error;
      setQuestions(data || []);
      setGameStatus('idle');
    } catch (e) {
      console.error('Error fetching questions:', e);
    }
  };

  const startGame = () => {
    setCurrentIdx(0);
    setScore(0);
    setTimeLeft(15);
    setSelectedOption(null);
    setIsCorrect(null);
    setGameStatus('playing');
  };

  const handleOptionClick = (idx: number) => {
    if (selectedOption !== null) return;
    
    setSelectedOption(idx);
    const correct = idx === questions[currentIdx].correct_answer;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(s => s + 100 + timeLeft * 10);
    }

    setTimeout(() => {
      if (currentIdx < questions.length - 1) {
        setCurrentIdx(c => c + 1);
        setSelectedOption(null);
        setIsCorrect(null);
        setTimeLeft(15);
      } else {
        finishGame();
      }
    }, 2000);
  };

  const finishGame = async () => {
    setGameStatus('finished');
    await saveScore(score);
  };

  const saveScore = async (finalScore: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from('leaderboard').insert({
        user_id: user?.id,
        user_name: user?.user_metadata?.full_name || 'Guest User',
        score: finalScore,
        game_type: 'Avurudu Quiz'
      });
    } catch (e) {
      console.error('Error saving score:', e);
    }
  };

  if (gameStatus === 'loading') return <div className="text-center p-20">{t('loading')}</div>;

  const currentQ = questions[currentIdx];

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-[#D41922] relative overflow-hidden">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-[#D41922] font-serif italic mb-2">{t('avuruduQuiz')}</h2>
          <p className="text-gray-500 font-medium">{t('quizDesc')}</p>
        </div>

        {gameStatus === 'idle' ? (
          <div className="text-center py-12 space-y-8">
            <div className="text-6xl animate-bounce">🏮</div>
            <button
              onClick={startGame}
              className="bg-[#D41922] text-white px-12 py-4 rounded-2xl font-black text-2xl shadow-xl hover:bg-[#B0141B] transition-all flex items-center gap-3 mx-auto"
            >
              <Play fill="currentColor" />
              {t('startQuiz')}
            </button>
          </div>
        ) : gameStatus === 'playing' ? (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-[#D41922] font-bold text-xl">
                <Timer size={24} />
                <span className={timeLeft < 5 ? 'text-red-500 animate-pulse' : ''}>{timeLeft}s</span>
              </div>
              <div className="text-gray-400 font-bold">
                {t('question')} {currentIdx + 1} {t('of')} {questions.length}
              </div>
              <div className="flex items-center gap-2 text-orange-500 font-bold text-xl">
                <Trophy size={24} />
                <span>{score}</span>
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-3xl border-2 border-gray-100 min-h-[120px] flex items-center justify-center text-center">
              <h3 className="text-2xl font-bold text-gray-800 leading-relaxed">
                {currentQ.question}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[currentQ.option1, currentQ.option2, currentQ.option3, currentQ.option4].map((opt, i) => {
                const isSelected = selectedOption === i + 1;
                const isCorrectOpt = currentQ.correct_answer === i + 1;
                
                let bgColor = 'bg-white border-gray-100 hover:border-orange-300';
                if (selectedOption !== null) {
                  if (isCorrectOpt) bgColor = 'bg-green-500 border-green-500 text-white';
                  else if (isSelected) bgColor = 'bg-red-500 border-red-500 text-white';
                  else bgColor = 'bg-gray-100 border-gray-100 text-gray-400 opacity-50';
                }

                return (
                  <motion.button
                    key={i}
                    whileHover={selectedOption === null ? { scale: 1.02 } : {}}
                    whileTap={selectedOption === null ? { scale: 0.98 } : {}}
                    onClick={() => handleOptionClick(i + 1)}
                    disabled={selectedOption !== null}
                    className={`
                      p-6 rounded-2xl border-2 text-left font-bold text-lg transition-all flex items-center justify-between
                      ${bgColor}
                    `}
                  >
                    <span>{opt}</span>
                    {selectedOption !== null && isCorrectOpt && <CheckCircle2 size={24} />}
                    {selectedOption !== null && isSelected && !isCorrectOpt && <XCircle size={24} />}
                  </motion.button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 space-y-8">
            <h4 className="text-5xl font-black text-[#D41922] font-serif italic">{t('quizCompleted')}</h4>
            <div className="bg-orange-50 p-8 rounded-3xl border-2 border-orange-100 max-w-sm mx-auto">
              <span className="text-sm font-bold text-orange-400 uppercase tracking-widest block mb-2">{t('finalScore')}</span>
              <span className="text-6xl font-black text-orange-600">{score}</span>
            </div>
            <button
              onClick={startGame}
              className="bg-gray-800 text-white px-12 py-4 rounded-2xl font-black text-xl shadow-xl hover:bg-gray-900 transition-all flex items-center gap-3 mx-auto"
            >
              <RefreshCw size={24} />
              {t('playAgain')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
