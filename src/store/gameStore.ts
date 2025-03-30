import { create } from 'zustand';
import { Chess } from 'chess.js';
import { GameStore } from '../types/chess';

export const useGameStore = create<GameStore>((set) => ({
  game: new Chess(),
  mode: 'single',
  difficulty: 'medium',
  theme: 'light',
  moveHistory: [],
  timeWhite: 600, // 10 minutes
  timeBlack: 600,
  isThinking: false,

  setMode: (mode) => set({ mode }),
  setDifficulty: (difficulty) => set({ difficulty }),
  setTheme: (theme) => set({ theme }),
  
  makeMove: (move) => set((state) => {
    const newGame = new Chess(state.game.fen());
    try {
      newGame.move(move);
      return {
        game: newGame,
        moveHistory: [...state.moveHistory, move],
      };
    } catch {
      return state;
    }
  }),

  undoMove: () => set((state) => {
    const newGame = new Chess(state.game.fen());
    newGame.undo();
    return {
      game: newGame,
      moveHistory: state.moveHistory.slice(0, -1),
    };
  }),

  resetGame: () => set((state) => ({
    game: new Chess(),
    moveHistory: [],
    timeWhite: 600,
    timeBlack: 600,
  })),

  updateTime: (color, time) => set((state) => ({
    ...(color === 'w' ? { timeWhite: time } : { timeBlack: time }),
  })),

  setThinking: (thinking) => set({ isThinking: thinking }),
}));