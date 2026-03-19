import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Timer, RefreshCw, CheckCircle2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useLanguage } from '../../lib/LanguageContext';

const WORDS = [
  { word: 'කැවුම්', display: 'කැවුම්' },
  { word: 'කොකිස්', display: 'කොකිස්' },
  { word: 'නැකත්', display: 'නැකත්' },
  { word: 'අවුරුදු', display: 'අවුරුදු' },
  { word: 'රබන්', display: 'රබන්' },
];

const GRID_SIZE = 10;
const SINHALA_CHARS = 'අආඇඈඉඊඋඌඍඎඑඒඓඔඕඖකඛගඝඞඟචඡජඣඤඥඦටඨඩඪණඬතථදධනඳපඵබභමයරලවශෂසහළෆ'.split('');

export default function WordSearch() {
  const { t } = useLanguage();
  const [grid, setGrid] = useState<string[][]>([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [selectedCells, setSelectedCells] = useState<{ r: number; c: number }[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const [score, setScore] = useState(0);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');

  useEffect(() => {
    generateGrid();
  }, []);

  useEffect(() => {
    if (gameStatus !== 'playing') return;
    if (timeLeft <= 0) {
      setGameStatus('lost');
      return;
    }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, gameStatus]);

  const generateGrid = () => {
    const newGrid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(''));
    
    // Place words
    WORDS.forEach(({ word }) => {
      let placed = false;
      while (!placed) {
        const direction = Math.floor(Math.random() * 3); // 0: horizontal, 1: vertical, 2: diagonal
        const row = Math.floor(Math.random() * GRID_SIZE);
        const col = Math.floor(Math.random() * GRID_SIZE);
        
        if (canPlaceWord(newGrid, word, row, col, direction)) {
          placeWord(newGrid, word, row, col, direction);
          placed = true;
        }
      }
    });

    // Fill empty cells
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (newGrid[r][c] === '') {
          newGrid[r][c] = SINHALA_CHARS[Math.floor(Math.random() * SINHALA_CHARS.length)];
        }
      }
    }
    setGrid(newGrid);
    setFoundWords([]);
    setScore(0);
    setTimeLeft(120);
    setGameStatus('playing');
  };

  const canPlaceWord = (grid: string[][], word: string, row: number, col: number, dir: number) => {
    if (dir === 0 && col + word.length > GRID_SIZE) return false;
    if (dir === 1 && row + word.length > GRID_SIZE) return false;
    if (dir === 2 && (row + word.length > GRID_SIZE || col + word.length > GRID_SIZE)) return false;

    for (let i = 0; i < word.length; i++) {
      const r = dir === 0 ? row : row + i;
      const c = dir === 1 ? col : col + i;
      if (grid[r][c] !== '' && grid[r][c] !== word[i]) return false;
    }
    return true;
  };

  const placeWord = (grid: string[][], word: string, row: number, col: number, dir: number) => {
    for (let i = 0; i < word.length; i++) {
      const r = dir === 0 ? row : row + i;
      const c = dir === 1 ? col : col + i;
      grid[r][c] = word[i];
    }
  };

  const handleMouseDown = (r: number, c: number) => {
    if (gameStatus !== 'playing') return;
    setIsDragging(true);
    setSelectedCells([{ r, c }]);
  };

  const handleMouseEnter = (r: number, c: number) => {
    if (!isDragging || gameStatus !== 'playing') return;
    const last = selectedCells[0];
    // Only allow straight lines
    if (r === last.r || c === last.c || Math.abs(r - last.r) === Math.abs(c - last.c)) {
      const cells: { r: number; c: number }[] = [];
      const dr = r === last.r ? 0 : r > last.r ? 1 : -1;
      const dc = c === last.c ? 0 : c > last.c ? 1 : -1;
      const steps = Math.max(Math.abs(r - last.r), Math.abs(c - last.c));
      
      for (let i = 0; i <= steps; i++) {
        cells.push({ r: last.r + i * dr, c: last.c + i * dc });
      }
      setSelectedCells(cells);
    }
  };

  const handleMouseUp = async () => {
    setIsDragging(false);
    const selectedWord = selectedCells.map(cell => grid[cell.r][cell.c]).join('');
    const reversedWord = selectedWord.split('').reverse().join('');
    
    const matched = WORDS.find(w => w.word === selectedWord || w.word === reversedWord);
    
    if (matched && !foundWords.includes(matched.word)) {
      const newFound = [...foundWords, matched.word];
      setFoundWords(newFound);
      setScore(s => s + 100);
      
      if (newFound.length === WORDS.length) {
        setGameStatus('won');
        await saveScore(score + 100 + timeLeft);
      }
    }
    setSelectedCells([]);
  };

  const saveScore = async (finalScore: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from('leaderboard').insert({
        user_id: user?.id,
        user_name: user?.user_metadata?.full_name || 'Guest User',
        score: finalScore,
        game_type: 'Word Search'
      });
    } catch (e) {
      console.error('Error saving score:', e);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Game Area */}
        <div className="flex-1">
          <div className="bg-white rounded-3xl shadow-xl p-6 border-4 border-[#D41922]">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2 text-[#D41922] font-bold">
                <Timer size={20} />
                <span>{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
              </div>
              <div className="flex items-center gap-2 text-orange-500 font-bold">
                <Trophy size={20} />
                <span>{t('score')}: {score}</span>
              </div>
              <button 
                onClick={generateGrid}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <RefreshCw size={20} className="text-gray-500" />
              </button>
            </div>

            <div 
              className="grid gap-1 select-none touch-none"
              style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}
              onMouseLeave={() => { setIsDragging(false); setSelectedCells([]); }}
            >
              {grid.map((row, r) => (
                row.map((char, c) => {
                  const isSelected = selectedCells.some(cell => cell.r === r && cell.c === c);
                  const isFound = foundWords.some(word => {
                    // This is a simplification, ideally we'd track specific cell coordinates for found words
                    return word.includes(char); 
                  });

                  return (
                    <div
                      key={`${r}-${c}`}
                      onMouseDown={() => handleMouseDown(r, c)}
                      onMouseEnter={() => handleMouseEnter(r, c)}
                      onMouseUp={handleMouseUp}
                      className={`
                        aspect-square flex items-center justify-center text-lg font-bold rounded-lg cursor-pointer
                        transition-all duration-200
                        ${isSelected ? 'bg-[#D41922] text-white scale-110 z-10' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}
                        ${isFound ? 'bg-green-100 text-green-700' : ''}
                      `}
                    >
                      {char}
                    </div>
                  );
                })
              ))}
            </div>
          </div>
        </div>

        {/* Word List */}
        <div className="w-full md:w-64 space-y-4">
          <div className="bg-white rounded-3xl shadow-lg p-6 border-2 border-orange-200">
            <h3 className="font-black text-xl text-[#D41922] mb-4 font-serif italic">{t('wordsToFind')}</h3>
            <div className="space-y-2">
              {WORDS.map(({ word, display }) => (
                <div 
                  key={word}
                  className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all ${
                    foundWords.includes(word) 
                      ? 'bg-green-50 border-green-200 text-green-700' 
                      : 'bg-gray-50 border-gray-100 text-gray-500'
                  }`}
                >
                  <span className="font-bold text-lg">{display}</span>
                  {foundWords.includes(word) && <CheckCircle2 size={18} />}
                </div>
              ))}
            </div>
          </div>

          <AnimatePresence>
            {gameStatus !== 'playing' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-6 rounded-3xl text-center text-white font-bold ${
                  gameStatus === 'won' ? 'bg-green-500' : 'bg-red-500'
                }`}
              >
                <h4 className="text-2xl mb-2">{gameStatus === 'won' ? t('youWon') : t('gameOver')}</h4>
                <p className="mb-4">{t('finalScore')}: {score + (gameStatus === 'won' ? timeLeft : 0)}</p>
                <button 
                  onClick={generateGrid}
                  className="bg-white text-gray-800 px-6 py-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  {t('playAgain')}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
