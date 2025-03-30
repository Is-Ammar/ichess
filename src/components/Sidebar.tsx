import React from 'react';
import { Moon, Sun, Undo2, RotateCcw, Brain, Users } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { GameMode, Difficulty, Theme } from '../types/chess';

export const Sidebar: React.FC = () => {
  const {
    mode,
    difficulty,
    theme,
    moveHistory,
    timeWhite,
    timeBlack,
    setMode,
    setDifficulty,
    setTheme,
    undoMove,
    resetGame,
  } = useGameStore();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`w-80 p-6 ${theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-white text-slate-800'} rounded-lg shadow-lg`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Chess Game</h2>
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Game Mode</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setMode('single')}
              className={`flex items-center gap-2 px-4 py-2 rounded ${
                mode === 'single' ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-700'
              }`}
            >
              <Brain size={18} /> Single
            </button>
            <button
              onClick={() => setMode('multi')}
              className={`flex items-center gap-2 px-4 py-2 rounded ${
                mode === 'multi' ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-700'
              }`}
            >
              <Users size={18} /> Multi
            </button>
          </div>
        </div>

        {mode === 'single' && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Difficulty</h3>
            <div className="flex gap-2">
              {(['easy', 'medium', 'hard'] as Difficulty[]).map((level) => (
                <button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className={`px-4 py-2 rounded capitalize ${
                    difficulty === level ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-700'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <h3 className="text-lg font-semibold mb-2">Time</h3>
          <div className="flex justify-between text-xl font-mono">
            <div>⚪ {formatTime(timeWhite)}</div>
            <div>⚫ {formatTime(timeBlack)}</div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Move History</h3>
          <div className="h-40 overflow-y-auto bg-slate-50 dark:bg-slate-700 rounded p-2">
            {moveHistory.map((move, i) => (
              <div key={i} className="font-mono">
                {i + 1}. {move}
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={undoMove}
            className="flex items-center gap-2 px-4 py-2 rounded bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600"
          >
            <Undo2 size={18} /> Undo
          </button>
          <button
            onClick={resetGame}
            className="flex items-center gap-2 px-4 py-2 rounded bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600"
          >
            <RotateCcw size={18} /> Reset
          </button>
        </div>
      </div>
    </div>
  );
};