import { Chess } from 'chess.js';

export type GameMode = 'single' | 'multi';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type Theme = 'light' | 'dark';

export interface GameState {
  game: Chess;
  mode: GameMode;
  difficulty: Difficulty;
  theme: Theme;
  moveHistory: string[];
  timeWhite: number;
  timeBlack: number;
  isThinking: boolean;
}

export interface GameStore extends GameState {
  setMode: (mode: GameMode) => void;
  setDifficulty: (difficulty: Difficulty) => void;
  setTheme: (theme: Theme) => void;
  makeMove: (move: string) => void;
  undoMove: () => void;
  resetGame: () => void;
  updateTime: (color: 'w' | 'b', time: number) => void;
  setThinking: (thinking: boolean) => void;
}