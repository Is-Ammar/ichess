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

  const timerRef = useRef<NodeJS.Timeout | null>(null);

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
    <div className={`w-full lg:w-80 p-4 lg:p-6 ${
      theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-white text-slate-800'
    } rounded-lg shadow-lg`}>
      <div className="flex justify-between items-center mb-4 lg:mb-6">
        <h2 className="text-xl lg:text-2xl font-bold">Chess Game</h2>
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      <div className="space-y-4 lg:space-y-6">
        <div>
          <h3 className="text-md lg:text-lg font-semibold mb-2">Game Mode</h3>
          <div className="flex gap-2">
            <button
              onClick={() => handleModeChange('single')}
              className={`flex-1 flex items-center justify-center gap-1 lg:gap-2 px-3 lg:px-4 py-1 lg:py-2 rounded text-sm lg:text-base ${
                mode === 'single' ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-700'
              }`}
            >
              <Brain size={16} /> <span>Single</span>
            </button>
            <button
              onClick={() => handleModeChange('multi')}
              className={`flex-1 flex items-center justify-center gap-1 lg:gap-2 px-3 lg:px-4 py-1 lg:py-2 rounded text-sm lg:text-base ${
                mode === 'multi' ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-700'
              }`}
            >
              <Users size={16} /> <span>Multi</span>
            </button>
          </div>
        </div>

        {mode === 'single' && (
          <>
            <div>
              <h3 className="text-md lg:text-lg font-semibold mb-2">Difficulty</h3>
              <div className="grid grid-cols-2 gap-2">
                {(['easy', 'medium'] as Difficulty[]).map((level) => (
                  <button
                    key={level}
                    onClick={() => setDifficulty(level)}
                    className={`px-3 lg:px-4 py-1 lg:py-2 rounded capitalize text-sm lg:text-base ${
                      difficulty === level ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-700'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-md lg:text-lg font-semibold mb-2">Play As</h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handlePlayerColorChange('w')}
                  className={`flex items-center justify-center gap-1 lg:gap-2 px-3 lg:px-4 py-1 lg:py-2 rounded text-sm lg:text-base ${
                    playerColor === 'w' ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-700'
                  }`}
                >
                  <CircleUser size={16} className="text-white" /> <span>White</span>
                </button>
                <button
                  onClick={() => handlePlayerColorChange('b')}
                  className={`flex items-center justify-center gap-1 lg:gap-2 px-3 lg:px-4 py-1 lg:py-2 rounded text-sm lg:text-base ${
                    playerColor === 'b' ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-700'
                  }`}
                >
                  <CircleUser size={16} className="text-black" /> <span>Black</span>
                </button>
              </div>
            </div>
          </>
        )}

        <div>
          <h3 className="text-md lg:text-lg font-semibold mb-2">Time</h3>
          <div className="flex justify-between text-lg lg:text-xl font-mono">
            <div>⚪ {formatTime(timeWhite)}</div>
            <div>⚫ {formatTime(timeBlack)}</div>
          </div>
        </div>

        {gameResult && (
          <div className="bg-yellow-100 dark:bg-yellow-900 p-2 lg:p-3 rounded-md border border-yellow-300 dark:border-yellow-700">
            <h3 className="text-md lg:text-lg font-semibold mb-1">Game Result</h3>
            <p className="text-sm lg:text-base font-medium">{getResultMessage()}</p>
          </div>
        )}

        <div>
          <h3 className="text-md lg:text-lg font-semibold mb-2">Move History</h3>
          <div className="h-24 lg:h-40 overflow-y-auto bg-slate-50 dark:bg-slate-700 rounded p-2 text-xs lg:text-sm">
            {moveHistory.length > 0 ? (
              <div className="font-mono">
                {moveHistory.map((move, i) => (
                  <span key={i} className="inline-block mr-1 lg:mr-2">
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

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={undoMove}
            disabled={isThinking || moveHistory.length === 0 || gameResult !== null}
            className={`flex items-center justify-center gap-1 lg:gap-2 px-3 lg:px-4 py-1 lg:py-2 rounded bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-sm lg:text-base ${
              (isThinking || moveHistory.length === 0 || gameResult !== null) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Undo2 size={16} /> <span>Undo</span>
          </button>
          <button
            onClick={resetGame}
            disabled={isThinking}
            className={`flex items-center justify-center gap-1 lg:gap-2 px-3 lg:px-4 py-1 lg:py-2 rounded bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-sm lg:text-base ${
              isThinking ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <RotateCcw size={16} /> <span>Reset</span>
          </button>
        </div>

        {!gameResult && (
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => offerDraw()}
              disabled={isThinking || gameResult !== null}
              className={`flex items-center justify-center gap-1 lg:gap-2 py-1 lg:py-2 rounded bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900 dark:text-amber-100 dark:hover:bg-amber-800 text-sm lg:text-base ${
                isThinking || gameResult !== null ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Handshake size={16} /> <span>Draw</span>
            </button>
            <button
              onClick={() => resign(game.turn())}
              disabled={isThinking || gameResult !== null}
              className={`flex items-center justify-center gap-1 lg:gap-2 py-1 lg:py-2 rounded bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-100 dark:hover:bg-red-800 text-sm lg:text-base ${
                isThinking || gameResult !== null ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Flag size={16} /> <span>Resign</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};