import { Chess } from 'chess.js';
import { Difficulty } from '../types/chess';

const openingBook: Record<string, string[]> = {
  // Standard openings
  'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -': ['e2e4', 'd2d4', 'c2c4', 'g1f3'],
  'rnbqkbnr/pppppppp/8/8/2P5/8/PP1PPPPP/RNBQKBNR b KQkq -': ['e7e5', 'c7c5', 'e7e6', 'g8f6'],
  'rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq -': ['d7d5', 'g8f6', 'e7e6', 'c7c5'],
  'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq -': ['e7e5', 'c7c5', 'e7e6', 'c7c6'],
  'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq -': ['g1f3', 'b1c3', 'f2f4', 'd2d4'],
  'rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq -': ['e4d5', 'e4e5', 'd2d4', 'g1f3'],
  'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq -': ['g1f3', 'f1c4', 'f2f4', 'd2d4'],
  // Add more positions as needed
};
// Piece values for material evaluation
const pieceValues = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000,
};

// Piece-square tables for positional evaluation
const pawnTable = [
  0,  0,  0,  0,  0,  0,  0,  0,
  50, 50, 50, 50, 50, 50, 50, 50,
  10, 10, 20, 30, 30, 20, 10, 10,
  5,  5, 10, 25, 25, 10,  5,  5,
  0,  0,  0, 20, 20,  0,  0,  0,
  5, -5,-10,  0,  0,-10, -5,  5,
  5, 10, 10,-20,-20, 10, 10,  5,
  0,  0,  0,  0,  0,  0,  0,  0
];

const knightTable = [
  -50,-40,-30,-30,-30,-30,-40,-50,
  -40,-20,  0,  0,  0,  0,-20,-40,
  -30,  0, 10, 15, 15, 10,  0,-30,
  -30,  5, 15, 20, 20, 15,  5,-30,
  -30,  0, 15, 20, 20, 15,  0,-30,
  -30,  5, 10, 15, 15, 10,  5,-30,
  -40,-20,  0,  5,  5,  0,-20,-40,
  -50,-40,-30,-30,-30,-30,-40,-50
];

const bishopTable = [
  -20,-10,-10,-10,-10,-10,-10,-20,
  -10,  0,  0,  0,  0,  0,  0,-10,
  -10,  0, 10, 10, 10, 10,  0,-10,
  -10,  5,  5, 10, 10,  5,  5,-10,
  -10,  0,  5, 10, 10,  5,  0,-10,
  -10,  5,  5,  5,  5,  5,  5,-10,
  -10,  0,  5,  0,  0,  5,  0,-10,
  -20,-10,-10,-10,-10,-10,-10,-20
];

const rookTable = [
  0,  0,  0,  0,  0,  0,  0,  0,
  5, 10, 10, 10, 10, 10, 10,  5,
  -5,  0,  0,  0,  0,  0,  0, -5,
  -5,  0,  0,  0,  0,  0,  0, -5,
  -5,  0,  0,  0,  0,  0,  0, -5,
  -5,  0,  0,  0,  0,  0,  0, -5,
  -5,  0,  0,  0,  0,  0,  0, -5,
  0,  0,  0,  5,  5,  0,  0,  0
];

const queenTable = [
  -20,-10,-10, -5, -5,-10,-10,-20,
  -10,  0,  0,  0,  0,  0,  0,-10,
  -10,  0,  5,  5,  5,  5,  0,-10,
  -5,  0,  5,  5,  5,  5,  0, -5,
  0,  0,  5,  5,  5,  5,  0, -5,
  -10,  5,  5,  5,  5,  5,  0,-10,
  -10,  0,  5,  0,  0,  0,  0,-10,
  -20,-10,-10, -5, -5,-10,-10,-20
];

const kingMidgameTable = [
  -30,-40,-40,-50,-50,-40,-40,-30,
  -30,-40,-40,-50,-50,-40,-40,-30,
  -30,-40,-40,-50,-50,-40,-40,-30,
  -30,-40,-40,-50,-50,-40,-40,-30,
  -20,-30,-30,-40,-40,-30,-30,-20,
  -10,-20,-20,-20,-20,-20,-20,-10,
  20, 20,  0,  0,  0,  0, 20, 20,
  20, 30, 10,  0,  0, 10, 30, 20
];

const kingEndgameTable = [
  -50,-40,-30,-20,-20,-30,-40,-50,
  -30,-20,-10,  0,  0,-10,-20,-30,
  -30,-10, 20, 30, 30, 20,-10,-30,
  -30,-10, 30, 40, 40, 30,-10,-30,
  -30,-10, 30, 40, 40, 30,-10,-30,
  -30,-10, 20, 30, 30, 20,-10,-30,
  -30,-30,  0,  0,  0,  0,-30,-30,
  -50,-30,-30,-30,-30,-30,-30,-50
];

// Evaluate position from white's perspective
export const evaluateBoard = (game: Chess): number => {
  if (game.isCheckmate()) {
    return game.turn() === 'w' ? -Infinity : Infinity;
  }
  
  if (game.isDraw() || game.isStalemate()) {
    return 0;
  }

  let score = 0;
  const board = game.board();
  
  // Count material and position
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const piece = board[i][j];
      if (!piece) continue;
      
      // Material score
      const materialValue = pieceValues[piece.type];
      
      // Position score
      let positionValue = 0;
      const squareIndex = i * 8 + j;
      const reverseIndex = piece.color === 'w' ? 63 - squareIndex : squareIndex;
      
      switch (piece.type) {
        case 'p': positionValue = pawnTable[reverseIndex]; break;
        case 'n': positionValue = knightTable[reverseIndex]; break;
        case 'b': positionValue = bishopTable[reverseIndex]; break;
        case 'r': positionValue = rookTable[reverseIndex]; break;
        case 'q': positionValue = queenTable[reverseIndex]; break;
        case 'k': {
          // Use midgame or endgame king table depending on queen presence
          const hasQueens = board.flat().some(p => p?.type === 'q');
          positionValue = hasQueens ? kingMidgameTable[reverseIndex] : kingEndgameTable[reverseIndex];
          break;
        }
      }
      
      // Add or subtract based on piece color
      const value = materialValue + positionValue;
      score += piece.color === 'w' ? value : -value;
    }
  }
  
  return score;
};

// Minimax algorithm with alpha-beta pruning
const minimax = (
  game: Chess, 
  depth: number, 
  alpha: number, 
  beta: number, 
  isMaximizingPlayer: boolean
): number => {
  if (depth === 0 || game.isGameOver()) {
    return evaluateBoard(game);
  }

  const moves = game.moves({ verbose: true });
  
  // Sort moves for better alpha-beta pruning
  moves.sort((a, b) => {
    const pieceValueA = pieceValues[a.captured || 'p'] || 0;
    const pieceValueB = pieceValues[b.captured || 'p'] || 0;
    return isMaximizingPlayer ? pieceValueB - pieceValueA : pieceValueA - pieceValueB;
  });

  if (isMaximizingPlayer) {
    let maxEval = -Infinity;
    for (const move of moves) {
      game.move(move);
      const evaluation = minimax(game, depth - 1, alpha, beta, false);
      game.undo();
      maxEval = Math.max(maxEval, evaluation);
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) break; // Beta cutoff
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      game.move(move);
      const evaluation = minimax(game, depth - 1, alpha, beta, true);
      game.undo();
      minEval = Math.min(minEval, evaluation);
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) break; // Alpha cutoff
    }
    return minEval;
  }
};

export const calculateBestMove = async (fen: string, difficulty: Difficulty): Promise<string> => {
  const game = new Chess(fen);
  const moves = game.moves({ verbose: true });
  
  if (moves.length === 0 || game.isGameOver()) {
    return '';
  }

  // First check if current position is in opening book
  const fenBase = fen.split(' ')[0]; // Get just the position part of FEN
  if (openingBook[fenBase]) {
    const bookMoves = openingBook[fenBase];
    const legalBookMoves = bookMoves.filter(move => 
      moves.some(m => m.from === move.substring(0, 2) && m.to === move.substring(2, 4))
    );
    
    // If we have book moves available, use them with high probability
    if (legalBookMoves.length > 0) {
      const useBookMove = Math.random() > 0.2; // 80% chance to use book move
      if (useBookMove || difficulty === 'easy') {
        const randomBookMove = legalBookMoves[
          Math.floor(Math.random() * legalBookMoves.length)
        ];
        return randomBookMove;
      }
    }
  }

  // Set search depth based on difficulty
  const searchDepth = 
    difficulty === 'easy' ? 2 : 
    difficulty === 'medium' ? 3 : 4;

  // Simulate "thinking" based on difficulty
  const delay = difficulty === 'easy' ? 500 : 
               difficulty === 'medium' ? 700 : 
               1000;
  await new Promise(resolve => setTimeout(resolve, delay));

  let bestMove = null;
  let bestEval = game.turn() === 'w' ? -Infinity : Infinity;
  const isMaximizing = game.turn() === 'w';

  // Evaluate each move
  for (const move of moves) {
    game.move(move);
    const evaluation = minimax(
      game, 
      searchDepth - 1, 
      -Infinity, 
      Infinity, 
      !isMaximizing
    );
    game.undo();

    if ((isMaximizing && evaluation > bestEval) || 
        (!isMaximizing && evaluation < bestEval)) {
      bestEval = evaluation;
      bestMove = move;
    }
  }

  // Random move for easy difficulty (30% chance)
  if (difficulty === 'easy' && Math.random() < 0.3) {
    const randomIndex = Math.floor(Math.random() * moves.length);
    bestMove = moves[randomIndex];
  }

  // Fallback to random move if no best move found
  if (!bestMove) {
    bestMove = moves[Math.floor(Math.random() * moves.length)];
  }

  return bestMove ? `${bestMove.from}${bestMove.to}${bestMove.promotion || ''}` : '';
};