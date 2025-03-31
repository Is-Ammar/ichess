import { create } from 'zustand';
import { Chess } from 'chess.js';
import { calculateBestMove, evaluateBoard } from '../utils/engine';
import { GameStore, GameMode, Difficulty, GameResult, Theme } from '../types/chess';
import { persist } from 'zustand/middleware';

const INITIAL_TIME = 600; // 10 minutes in seconds

// Helper function to create a new game instance
const createNewGame = () => new Chess();

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      game: createNewGame(),
      mode: 'single',
      difficulty: 'medium',
      theme: 'light',
      moveHistory: [],
      timeWhite: INITIAL_TIME,
      timeBlack: INITIAL_TIME,
      isThinking: false,
      gameResult: null,
      playerColor: 'w',

      // Setters
      setMode: (mode: GameMode) => set({ mode, gameResult: null }),
      setDifficulty: (difficulty: Difficulty) => set({ difficulty }),
      setTheme: (theme: Theme) => set({ theme }),
      setPlayerColor: (color: 'w' | 'b') => set({ playerColor: color }),
      
      // Core game actions
      makeMove: async (move) => {
        const { game, mode, playerColor, moveHistory } = get();
        const newGame = new Chess(game.fen());
        
        try {
          // Parse move input
          const moveObj = typeof move === 'string' 
            ? { 
                from: move.substring(0, 2), 
                to: move.substring(2, 4), 
                promotion: move.length > 4 ? move.substring(4, 5) : 'q'
              }
            : { ...move, promotion: move.promotion || 'q' };
            
          const result = newGame.move(moveObj);
          if (!result) return;

          // Update state
          set({
            game: newGame,
            moveHistory: [...moveHistory, result.san],
            gameResult: null
          });

          // Check game status
          if (newGame.isGameOver()) {
            const gameResult = determineGameResult(newGame);
            set({ gameResult });
            return;
          }

          // Handle computer move in single player mode
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

      resetGame: () => set({
        game: createNewGame(),
        moveHistory: [],
        timeWhite: INITIAL_TIME,
        timeBlack: INITIAL_TIME,
        gameResult: null,
        isThinking: false
      }),

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
        moveHistory: state.moveHistory, // Add move history to persisted state
        timeWhite: state.timeWhite, // Add time to persisted state
        timeBlack: state.timeBlack  // Add time to persisted state
      }),
      merge: (persistedState, currentState) => {
        // Recreate the game from the move history when hydrating
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
          isThinking: false, // Reset thinking state on load
          gameResult: null   // Reset game result on load
        };
      }
    }
  )
);

// Helper function to determine the game result
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
  
  return { winner: null, reason: 'stalemate' }; // Default to a valid reason
};

// Helper function to calculate probability of accepting a draw offer
const calculateDrawAcceptProbability = (evaluation: number, difficulty: Difficulty): number => {
  // Convert evaluation to absolute value (perspective doesn't matter for draw acceptance)
  const absEval = Math.abs(evaluation);
  
  // Base probability depends on how even the position is
  let baseProbability = Math.max(0, 1 - absEval / 2);
  
  // Adjust based on difficulty
  switch (difficulty) {
    case 'easy':
      return Math.min(1, baseProbability + 0.3);
    case 'medium':
      return baseProbability;
    case 'hard':
      return Math.max(0, baseProbability - 0.3);
    default:
      return baseProbability;
  }
};
