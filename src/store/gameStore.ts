import { create } from 'zustand';
import { Chess } from 'chess.js';
import { calculateBestMove, evaluateBoard } from '../utils/engine';
import { GameStore, GameMode, Difficulty, GameResult, Theme, TimeControl } from '../types/chess';
import { persist } from 'zustand/middleware';

const TIME_CONTROLS = {
  bullet: { name: 'Bullet', time: 60 },
  blitz: { name: 'Blitz', time: 300 },
  rapid: { name: 'Rapid', time: 600 },
  classical: { name: 'Classical', time: 1800 },
  custom: { name: 'Custom', time: 600 }
};

const createNewGame = () => new Chess();

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      game: createNewGame(),
      mode: 'single',
      difficulty: 'medium',
      theme: 'light',
      moveHistory: [],
      timeControl: 'rapid',
      timeWhite: TIME_CONTROLS.rapid.time,
      timeBlack: TIME_CONTROLS.rapid.time,
      isThinking: false,
      gameResult: null,
      playerColor: 'w',

      setMode: (mode: GameMode) => set({ mode, gameResult: null }),
      setDifficulty: (difficulty: Difficulty) => set({ difficulty }),
      setTheme: (theme: Theme) => set({ theme }),
      setPlayerColor: (color: 'w' | 'b') => set({ playerColor: color }),
      setTimeControl: (timeControl: TimeControl) => set({ 
        timeControl,
        timeWhite: TIME_CONTROLS[timeControl].time,
        timeBlack: TIME_CONTROLS[timeControl].time
      }),
      setCustomTimeControl: (minutes: number) => set({
        timeControl: 'custom',
        timeWhite: minutes * 60,
        timeBlack: minutes * 60
      }),

      makeMove: async (move) => {
        const { game, mode, playerColor, moveHistory } = get();
        const newGame = new Chess(game.fen());
        
        try {
          const moveObj = typeof move === 'string' 
            ? { 
                from: move.substring(0, 2), 
                to: move.substring(2, 4), 
                promotion: move.length > 4 ? move.substring(4, 5) : 'q'
              }
            : { ...move, promotion: move.promotion || 'q' };
            
          const result = newGame.move(moveObj);
          if (!result) return;

          set({
            game: newGame,
            moveHistory: [...moveHistory, result.san],
            gameResult: null
          });
          if (newGame.isGameOver()) {
            const gameResult = determineGameResult(newGame);
            set({ gameResult });
            return;
          }
          if (mode === 'single' && newGame.turn() !== playerColor) {
            await get().makeComputerMove();
          }
        } catch (error) {
          console.error('Invalid move:', error);
        }
      },
      
      makeComputerMove: async () => {
        const { game, mode, difficulty } = get();
        if (game.isGameOver() || mode !== 'single') return;

        set({ isThinking: true });
        
        try {
          const moveString = await calculateBestMove(game.fen(), difficulty);
          if (moveString) {
            await new Promise(resolve => setTimeout(resolve, 300));
            await get().makeMove(moveString);
          }
        } catch (error) {
          console.error('Computer move error:', error);
        } finally {
          set({ isThinking: false });
        }
      },

      undoMove: () => {
        const { game, mode, playerColor, moveHistory } = get();
        const newGame = new Chess(game.fen());
        
        const movesToUndo = mode === 'single' && game.turn() !== playerColor ? 2 : 1;
        let movesUndone = 0;

        while (movesUndone < movesToUndo && newGame.history().length > 0) {
          newGame.undo();
          movesUndone++;
        }

        set({
          game: newGame,
          moveHistory: moveHistory.slice(0, -movesUndone),
          gameResult: null,
          isThinking: false
        });
      },

      resetGame: () => {
        const { timeControl } = get();
        set({
          game: createNewGame(),
          moveHistory: [],
          timeWhite: TIME_CONTROLS[timeControl].time,
          timeBlack: TIME_CONTROLS[timeControl].time,
          gameResult: null,
          isThinking: false
        });
      },

      updateTime: (color, time) => {
        if (get().gameResult) return;
        set(color === 'w' ? { timeWhite: time } : { timeBlack: time });
      },

      setThinking: (thinking) => set({ isThinking: thinking }),
      
      offerDraw: () => {
        const { game, mode, difficulty } = get();
        
        if (game.isGameOver()) return false;

        if (mode === 'single') {
          const evaluation = evaluateBoard(new Chess(game.fen()));
          const acceptProbability = calculateDrawAcceptProbability(evaluation, difficulty);
          
          if (Math.random() < acceptProbability) {
            set({ gameResult: { winner: null, reason: 'agreement' } });
            return true;
          }
          return false;
        }
        
        return false;
      },
      
      resign: (color: 'w' | 'b') => {
        if (get().gameResult) return;
        set({
          gameResult: {
            winner: color === 'w' ? 'b' : 'w',
            reason: 'resignation'
          }
        });
      },
    }),
    {
      name: 'chess-game-storage',
      partialize: (state) => ({ 
        mode: state.mode,
        difficulty: state.difficulty,
        theme: state.theme,
        playerColor: state.playerColor,
        moveHistory: state.moveHistory,
        timeControl: state.timeControl,
        timeWhite: state.timeWhite, 
        timeBlack: state.timeBlack 
      }),
      merge: (persistedState, currentState) => {

        const game = createNewGame();
        const moveHistory = (persistedState as any).moveHistory || [];
        
        try {
          moveHistory.forEach((move: string) => {
            game.move(move);
          });
        } catch (e) {
          console.error('Error recreating game from history:', e);
        }

        return {
          ...currentState,
          ...(typeof persistedState === 'object' && persistedState !== null ? persistedState : {}),
          game,
          isThinking: false,
          gameResult: null 
        };
      }
    }
  )
);

const determineGameResult = (game: Chess): GameResult => {
  if (game.isCheckmate()) {
    return {
      winner: game.turn() === 'w' ? 'b' : 'w',
      reason: 'checkmate'
    };
  } else if (game.isDraw()) {
    let reason: 'stalemate' | 'insufficient' | 'repetition' | 'fifty-move' | 'agreement' = 'stalemate';
    
    if (game.isStalemate()) {
      reason = 'stalemate';
    } else if (game.isInsufficientMaterial()) {
      reason = 'insufficient';
    } else if (game.isThreefoldRepetition()) {
      reason = 'repetition';
    } else {
      reason = 'fifty-move';
    }
    
    return { winner: null, reason };
  }
  
  return { winner: null, reason: 'stalemate' };
};

const calculateDrawAcceptProbability = (evaluation: number, difficulty: Difficulty): number => {
  const absEval = Math.abs(evaluation);
  
  let baseProbability = Math.max(0, 1 - absEval / 2);
 
  switch (difficulty) {
    case 'easy':
      return Math.min(1, baseProbability + 0.3);
    case 'medium':
      return baseProbability;
    default:
      return baseProbability;
  }
};