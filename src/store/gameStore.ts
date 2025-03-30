import { create } from 'zustand';
import { Chess } from 'chess.js';
import { calculateBestMove } from '../utils/engine';
import { evaluateBoard } from '../utils/engine';
import { GameStore, GameMode, Difficulty, GameResult, Theme } from '../types/chess';
import { persist } from 'zustand/middleware';

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      game: new Chess(),
      mode: 'single',
      difficulty: 'medium',
      theme: 'light',
      moveHistory: [],
      timeWhite: 600,
      timeBlack: 600,
      isThinking: false,
      gameResult: null,
      playerColor: 'w',

      setMode: (mode: GameMode) => set({ mode }),
      setDifficulty: (difficulty: Difficulty) => set({ difficulty }),
      setTheme: (theme: Theme | undefined) => set({ theme }),
      setPlayerColor: (color: 'w' | 'b') => set({ playerColor: color }),
      
      makeMove: async (move) => {
        const state = get();
        const newGame = new Chess(state.game.fen());
        
        try {
          // Handle pawn promotion
          const moveObj = typeof move === 'string' 
            ? { from: move.substring(0, 2), to: move.substring(2, 4), promotion: move.length > 4 ? move.substring(4, 5) : undefined }
            : move;
            
          const result = newGame.move(moveObj);
          
          if (!result) return;
          
          // Update state with the new move
          set({
            game: newGame,
            moveHistory: [...state.moveHistory, result.san],
          });
          
          // Check for game end
          if (newGame.isGameOver()) {
            let gameResult: GameResult | null = null;
            
            if (newGame.isCheckmate()) {
              gameResult = {
                winner: newGame.turn() === 'w' ? 'b' : 'w',
                reason: 'checkmate'
              };
            } else if (newGame.isDraw()) {
              gameResult = {
                winner: null,
                reason: newGame.isStalemate() ? 'stalemate' : 
                       newGame.isThreefoldRepetition() ? 'repetition' : 
                       newGame.isInsufficientMaterial() ? 'insufficient' : 'fifty-move'
              };
            }
            
            set({ gameResult });
            return;
          }
          
          // Make computer move if in single player mode and it's computer's turn
          if (state.mode === 'single' && newGame.turn() !== state.playerColor) {
            await get().makeComputerMove();
          }
        } catch (error) {
          console.error('Invalid move:', error);
        }
      },
      
      makeComputerMove: async () => {
        const state = get();
        if (state.game.isGameOver() || state.mode !== 'single') return;
        
        set({ isThinking: true });
        
        try {
          const fen = state.game.fen();
          const moveString = await calculateBestMove(fen, state.difficulty);
          
          if (moveString) {
            // Small delay to make it feel more natural
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
        const state = get();
        const newGame = new Chess(state.game.fen());
        
        // In single player, undo both player and computer moves
        if (state.mode === 'single') {
          newGame.undo();
          if (newGame.turn() !== state.playerColor) {
            newGame.undo();
          }
        } else {
          newGame.undo();
        }
        
        set({
          game: newGame,
          moveHistory: state.moveHistory.slice(0, state.mode === 'single' ? -2 : -1),
          gameResult: null
        });
      },

      resetGame: () => set({
        game: new Chess(),
        moveHistory: [],
        timeWhite: 600,
        timeBlack: 600,
        gameResult: null,
        isThinking: false
      }),

      updateTime: (color, time) => set({
        ...(color === 'w' ? { timeWhite: time } : { timeBlack: time }),
      }),

      setThinking: (thinking) => set({ isThinking: thinking }),
      
      offerDraw: () => {
        const state = get();
        
        if (state.mode === 'single') {
          // Get position evaluation from the engine
          const game = new Chess(state.game.fen());
          const evaluation = evaluateBoard(game);
          
          // Computer is more likely to accept draws when:
          // 1. Position is neutral or slightly disadvantageous
          // 2. Difficulty is lower (easier opponents accept draws more readily)
          const positionFactor = Math.max(0, 1 - Math.abs(evaluation) / 500);
          const difficultyFactor = 
            state.difficulty === 'easy' ? 0.8 : 
            state.difficulty === 'medium' ? 0.5 : 0.3;
          
          // Combined probability of accepting draw
          const acceptProbability = (positionFactor + difficultyFactor) / 2;
          
          if (Math.random() < acceptProbability) {
            set({ 
              gameResult: { winner: null, reason: 'agreement' } 
            });
            return true;
          }
          return false;
        }
        
        // For multiplayer, this would connect to draw offer logic
        return false;
      },
      
      resign: (color: 'w' | 'b') => set({
        gameResult: {
          winner: color === 'w' ? 'b' : 'w',
          reason: 'resignation'
        }
      }),
    }),
    {
      name: 'chess-game-storage',
      partialize: (state) => ({ 
        difficulty: state.difficulty,
        theme: state.theme,
        playerColor: state.playerColor
      })
    }
  )
);