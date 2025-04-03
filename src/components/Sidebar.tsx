import React, { useEffect, useRef } from 'react';
import { Moon, Sun, Undo2, RotateCcw, Brain, Users, Flag, Handshake, CircleUser } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { Difficulty } from '../types/chess';

export const Sidebar: React.FC = () => {
  const {
    game,
    mode,
    difficulty,
    theme,
    moveHistory,
    gameResult,
    playerColor,
    isThinking,
    timeWhite,
    timeBlack,
    setMode,
    setDifficulty,
    setTheme,
    setPlayerColor,
    undoMove,
    resetGame,
    resign,
    offerDraw,
    updateTime
  } = useGameStore();

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    if (gameResult) return;

    timerRef.current = setInterval(() => {
      const currentColor = game.turn();
      if (currentColor === 'w') {
        updateTime('w', Math.max(0, timeWhite - 1));
        if (timeWhite <= 1) {
          resign('w');
          clearInterval(timerRef.current!);
        }
      } else {
        updateTime('b', Math.max(0, timeBlack - 1));
        if (timeBlack <= 1) {
          resign('b');
          clearInterval(timerRef.current!);
        }
      }
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [game, timeWhite, timeBlack, gameResult, updateTime, resign]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const getResultMessage = () => {
    if (!gameResult) return null;
    
    const winner = gameResult.winner === 'w' ? 'White' : gameResult.winner === 'b' ? 'Black' : 'Nobody';
    let reason = '';
    
    switch (gameResult.reason) {
      case 'checkmate': reason = 'by checkmate'; break;
      case 'stalemate': reason = 'by stalemate'; break;
      case 'repetition': reason = 'by threefold repetition'; break;
      case 'insufficient': reason = 'by insufficient material'; break;
      case 'fifty-move': reason = 'by fifty-move rule'; break;
      case 'agreement': reason = 'by agreement'; break;
      case 'resignation': reason = 'by resignation'; break;
      case 'timeout': reason = 'by timeout'; break;
    }
    
    return `${winner} wins ${reason}`;
  };

  const handleModeChange = (newMode: 'single' | 'multi') => {
    setMode(newMode);
    resetGame();
  };

  const handlePlayerColorChange = (color: 'w' | 'b') => {
    setPlayerColor(color);
    resetGame();
    if (color === 'b' && mode === 'single') {
      setTimeout(() => {
        useGameStore.getState().makeComputerMove();
      }, 500);
    }
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
              onClick={() => handleModeChange('single')}
              className={`flex items-center gap-2 px-4 py-2 rounded ${
                mode === 'single' ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-700'
              }`}
            >
              <Brain size={18} /> Single
            </button>
            <button
              onClick={() => handleModeChange('multi')}
              className={`flex items-center gap-2 px-4 py-2 rounded ${
                mode === 'multi' ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-700'
              }`}
            >
              <Users size={18} /> Multi
            </button>
          </div>
        </div>

        {mode === 'single' && (
          <>
            <div>
              <h3 className="text-lg font-semibold mb-2">Difficulty</h3>
              <div className="flex gap-2">
                {(['easy', 'medium'] as Difficulty[]).map((level) => (
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
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Play As</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePlayerColorChange('w')}
                  className={`flex items-center gap-2 px-4 py-2 rounded ${
                    playerColor === 'w' ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-700'
                  }`}
                >
                  <CircleUser size={18} className="text-white" /> White
                </button>
                <button
                  onClick={() => handlePlayerColorChange('b')}
                  className={`flex items-center gap-2 px-4 py-2 rounded ${
                    playerColor === 'b' ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-700'
                  }`}
                >
                  <CircleUser size={18} className="text-black" /> Black
                </button>
              </div>
            </div>
          </>
        )}

        <div>
          <h3 className="text-lg font-semibold mb-2">Time</h3>
          <div className="flex justify-between text-xl font-mono">
            <div>⚪ {formatTime(timeWhite)}</div>
            <div>⚫ {formatTime(timeBlack)}</div>
          </div>
        </div>

        {gameResult && (
          <div className="bg-yellow-100 dark:bg-yellow-900 p-3 rounded-md border border-yellow-300 dark:border-yellow-700">
            <h3 className="text-lg font-semibold mb-1">Game Result</h3>
            <p className="font-medium">{getResultMessage()}</p>
          </div>
        )}

        <div>
          <h3 className="text-lg font-semibold mb-2">Move History</h3>
          <div className="h-40 overflow-y-auto bg-slate-50 dark:bg-slate-700 rounded p-2">
            {moveHistory.length > 0 ? (
              <div className="font-mono">
                {moveHistory.map((move, i) => (
                  <span key={i} className="inline-block mr-2">
                    {i % 2 === 0 ? `${Math.floor(i/2)+1}.` : ''} {move}{' '}
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-slate-400 dark:text-slate-500 italic text-center pt-2">
                No moves yet
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={undoMove}
            disabled={isThinking || moveHistory.length === 0 || gameResult !== null}
            className={`flex items-center gap-2 px-4 py-2 rounded bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 ${
              (isThinking || moveHistory.length === 0 || gameResult !== null) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Undo2 size={18} /> Undo
          </button>
          <button
            onClick={resetGame}
            disabled={isThinking}
            className={`flex items-center gap-2 px-4 py-2 rounded bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 ${
              isThinking ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <RotateCcw size={18} /> Reset
          </button>
        </div>

        {!gameResult && (
          <div className="flex gap-2">
            <button
              onClick={() => offerDraw()}
              disabled={isThinking || gameResult !== null}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900 dark:text-amber-100 dark:hover:bg-amber-800 ${
                isThinking || gameResult !== null ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Handshake size={18} /> Offer Draw
            </button>
            <button
              onClick={() => resign(game.turn())}
              disabled={isThinking || gameResult !== null}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-100 dark:hover:bg-red-800 ${
                isThinking || gameResult !== null ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Flag size={18} /> Resign
            </button>
          </div>
        )}
      </div>
    </div>
  );
};