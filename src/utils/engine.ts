import { Chess } from 'chess.js';
import { Difficulty } from '../types/chess';

// Simplified chess engine using basic piece values and position evaluation
const pieceValues = {
  p: 1,
  n: 3,
  b: 3,
  r: 5,
  q: 9,
  k: 0,
};

export const calculateBestMove = async (fen: string, difficulty: Difficulty): Promise<string> => {
  // In a real implementation, this would use Stockfish.js
  // For now, we'll return a random legal move
  const game = new Chess(fen);
  const moves = game.moves({ verbose: true });
  
  if (moves.length === 0) return '';

  // Simulate "thinking" based on difficulty
  const delay = difficulty === 'easy' ? 500 : difficulty === 'medium' ? 1000 : 2000;
  await new Promise(resolve => setTimeout(resolve, delay));

  const randomIndex = Math.floor(Math.random() * moves.length);
  const move = moves[randomIndex];
  
  return `${move.from}${move.to}`;
};