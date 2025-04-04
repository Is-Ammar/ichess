import { Chess } from 'chess.js';

export type GameMode = 'single' | 'multi';
export type Difficulty = 'easy' | 'medium' ;
export type Theme = 'light' | 'dark';

export interface GameResult {
  winner: 'w' | 'b' | null;
  reason: 'checkmate' | 'stalemate' | 'repetition' | 'insufficient' | 'fifty-move' | 'agreement' | 'resignation' | 'timeout';
}

export interface GameState {
  game: Chess;
  mode: GameMode;
  difficulty: Difficulty;
  theme: Theme;
  moveHistory: string[];
  timeWhite: number;
  timeBlack: number;
  isThinking: boolean;
  gameResult: GameResult | null;
  playerColor: 'w' | 'b';
}

export interface GameStore extends GameState {
  setMode: (mode: GameMode) => void;
  setDifficulty: (difficulty: Difficulty) => void;
  setTheme: (theme: Theme) => void;
  setPlayerColor: (color: 'w' | 'b') => void;
  makeMove: (move: string | { from: string; to: string; promotion?: string }) => Promise<void>;
  makeComputerMove: () => Promise<void>;
  undoMove: () => void;
  resetGame: () => void;
  updateTime: (color: 'w' | 'b', time: number) => void;
  setThinking: (thinking: boolean) => void;
  offerDraw: () => boolean;
  resign: (color: 'w' | 'b') => void;
}
export type TimeControl = 'bullet' | 'blitz' | 'rapid' | 'classical' | 'custom';

export interface GameStore {
  game: Chess;
  mode: GameMode;
  difficulty: Difficulty;
  theme: Theme;
  moveHistory: string[];
  timeControl: TimeControl;
  timeWhite: number;
  timeBlack: number;
  isThinking: boolean;
  setCustomTimeControl: (minutes: number) => void;
  gameResult: GameResult | null;
  playerColor: 'w' | 'b';
  message: string | null;
  messageTimeout: NodeJS.Timeout | null;
  setMessage: (message: string | null) => void;
  
  setMode: (mode: GameMode) => void;
  setDifficulty: (difficulty: Difficulty) => void;
  setTheme: (theme: Theme) => void;
  setPlayerColor: (color: 'w' | 'b') => void;
  setTimeControl: (timeControl: TimeControl) => void;  // Add this line
  // ...existing methods...
}