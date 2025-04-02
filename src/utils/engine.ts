import { Chess } from 'chess.js';
import { Difficulty } from '../types/chess';

const pieceValues = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 950,
  k: 20000,
};

const pst: Record<string, { mg: number[], eg: number[] }> = {
  p: {
    mg: [
      0, 0, 0, 0, 0, 0, 0, 0,
      50, 50, 50, 50, 50, 50, 50, 50,
      10, 10, 20, 30, 30, 20, 10, 10,
      5, 5, 10, 27, 27, 10, 5, 5,
      0, 0, 0, 25, 25, 0, 0, 0,
      5, -5, -10, 0, 0, -10, -5, 5,
      5, 10, 10, -25, -25, 10, 10, 5,
      0, 0, 0, 0, 0, 0, 0, 0
    ],
    eg: [
      0, 0, 0, 0, 0, 0, 0, 0,
      80, 80, 80, 80, 80, 80, 80, 80,
      50, 50, 50, 50, 50, 50, 50, 50,
      30, 30, 30, 30, 30, 30, 30, 30,
      20, 20, 20, 20, 20, 20, 20, 20,
      10, 10, 10, 10, 10, 10, 10, 10,
      0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0
    ]
  },
  n: {
    mg: [
      -50, -40, -30, -30, -30, -30, -40, -50,
      -40, -20, 0, 5, 5, 0, -20, -40,
      -30, 5, 10, 15, 15, 10, 5, -30,
      -30, 0, 15, 20, 20, 15, 0, -30,
      -30, 5, 15, 20, 20, 15, 5, -30,
      -30, 0, 10, 15, 15, 10, 0, -30,
      -40, -20, 0, 0, 0, 0, -20, -40,
      -50, -40, -30, -30, -30, -30, -40, -50
    ],
    eg: [
      -50, -40, -30, -30, -30, -30, -40, -50,
      -40, -20, 0, 0, 0, 0, -20, -40,
      -30, 0, 10, 15, 15, 10, 0, -30,
      -30, 5, 15, 20, 20, 15, 5, -30,
      -30, 0, 15, 20, 20, 15, 0, -30,
      -30, 5, 10, 15, 15, 10, 5, -30,
      -40, -20, 0, 5, 5, 0, -20, -40,
      -50, -40, -30, -30, -30, -30, -40, -50
    ]
  },
  b: {
    mg: [
      -20, -10, -10, -10, -10, -10, -10, -20,
      -10, 5, 0, 0, 0, 0, 5, -10,
      -10, 10, 10, 10, 10, 10, 10, -10,
      -10, 0, 10, 10, 10, 10, 0, -10,
      -10, 5, 5, 10, 10, 5, 5, -10,
      -10, 0, 5, 10, 10, 5, 0, -10,
      -10, 0, 0, 0, 0, 0, 0, -10,
      -20, -10, -10, -10, -10, -10, -10, -20
    ],
    eg: [
      -20, -10, -10, -10, -10, -10, -10, -20,
      -10, 0, 0, 0, 0, 0, 0, -10,
      -10, 0, 5, 10, 10, 5, 0, -10,
      -10, 5, 5, 10, 10, 5, 5, -10,
      -10, 0, 10, 10, 10, 10, 0, -10,
      -10, 10, 10, 10, 10, 10, 10, -10,
      -10, 5, 0, 0, 0, 0, 5, -10,
      -20, -10, -10, -10, -10, -10, -10, -20
    ]
  },
  r: {
    mg: [
      0, 0, 0, 5, 5, 0, 0, 0,
      -5, 0, 0, 0, 0, 0, 0, -5,
      -5, 0, 0, 0, 0, 0, 0, -5,
      -5, 0, 0, 0, 0, 0, 0, -5,
      -5, 0, 0, 0, 0, 0, 0, -5,
      -5, 0, 0, 0, 0, 0, 0, -5,
      5, 10, 10, 10, 10, 10, 10, 5,
      0, 0, 0, 0, 0, 0, 0, 0
    ],
    eg: [
      0, 0, 0, 0, 0, 0, 0, 0,
      5, 10, 10, 10, 10, 10, 10, 5,
      -5, 0, 0, 0, 0, 0, 0, -5,
      -5, 0, 0, 0, 0, 0, 0, -5,
      -5, 0, 0, 0, 0, 0, 0, -5,
      -5, 0, 0, 0, 0, 0, 0, -5,
      -5, 0, 0, 0, 0, 0, 0, -5,
      0, 0, 0, 5, 5, 0, 0, 0
    ]
  },
  q: {
    mg: [
      -20, -10, -10, -5, -5, -10, -10, -20,
      -10, 0, 5, 0, 0, 0, 0, -10,
      -10, 5, 5, 5, 5, 5, 0, -10,
      0, 0, 5, 5, 5, 5, 0, -5,
      -5, 0, 5, 5, 5, 5, 0, -5,
      -10, 0, 5, 5, 5, 5, 0, -10,
      -10, 0, 0, 0, 0, 0, 0, -10,
      -20, -10, -10, -5, -5, -10, -10, -20
    ],
    eg: [
      -20, -10, -10, -5, -5, -10, -10, -20,
      -10, 0, 0, 0, 0, 0, 0, -10,
      -10, 0, 5, 5, 5, 5, 0, -10,
      -5, 0, 5, 5, 5, 5, 0, -5,
      0, 0, 5, 5, 5, 5, 0, -5,
      -10, 5, 5, 5, 5, 5, 0, -10,
      -10, 0, 5, 0, 0, 0, 0, -10,
      -20, -10, -10, -5, -5, -10, -10, -20
    ]
  },
  k: {
    mg: [
      20, 30, 10, 0, 0, 10, 30, 20,
      20, 20, 0, 0, 0, 0, 20, 20,
      -10, -20, -20, -20, -20, -20, -20, -10,
      -20, -30, -30, -40, -40, -30, -30, -20,
      -30, -40, -40, -50, -50, -40, -40, -30,
      -30, -40, -40, -50, -50, -40, -40, -30,
      -30, -40, -40, -50, -50, -40, -40, -30,
      -30, -40, -40, -50, -50, -40, -40, -30
    ],
    eg: [
      -50, -40, -30, -20, -20, -30, -40, -50,
      -30, -20, -10, 0, 0, -10, -20, -30,
      -30, -10, 20, 30, 30, 20, -10, -30,
      -30, -10, 30, 40, 40, 30, -10, -30,
      -30, -10, 30, 40, 40, 30, -10, -30,
      -30, -10, 20, 30, 30, 20, -10, -30,
      -30, -30, 0, 0, 0, 0, -30, -30,
      -50, -30, -30, -30, -30, -30, -30, -50
    ]
  }
};

// Enhanced opening book with more variations
const openingBook: Record<string, string[]> = {
  'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -': ['e2e4', 'd2d4', 'g1f3', 'c2c4'],
  'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq -': ['e7e5', 'c7c5', 'e7e6', 'c7c6'],
  'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq -': ['g1f3', 'f1c4', 'f2f4'],
  'rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq -': ['b8c6', 'g8f6', 'd7d5'],
  'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq -': ['f1b5', 'd2d4', 'b1c3'],
  'r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq -': ['a7a6', 'g8f6', 'd7d6'],
  'r1bqkbnr/1ppp1ppp/p1n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq -': ['b5c6', 'b5a4', 'e1g1'],
  'r1bqkbnr/1ppp1ppp/p1B5/4p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq -': ['d7c6', 'b7c6'],
  'rnbqkbnr/ppp2ppp/3p4/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq -': ['d2d4', 'f1c4', 'b1c3'],
  'rnbqkbnr/ppp2ppp/3p4/4p3/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq -': ['e5d4', 'g8f6'],
  'rnbqkb1r/ppp2ppp/3p1n2/4p3/3PP3/5N2/PPP2PPP/RNBQKB1R w KQkq -': ['e4e5', 'b1c3', 'f1d3'],
  'rnbqkb1r/ppp2ppp/3p1n2/4P3/3P4/5N2/PPP2PPP/RNBQKB1R b KQkq -': ['f6d5', 'f6g4', 'd6e5'],
  'rnbqkb1r/ppp2ppp/5n2/4p3/3P4/5N2/PPP2PPP/RNBQKB1R w KQkq -': ['c2c4', 'f1e2', 'b1c3'],
  'rnbqkb1r/ppp2ppp/5n2/4p3/2PP4/5N2/PP3PPP/RNBQKB1R b KQkq -': ['e5d4', 'c7c6', 'b8c6'],
  'rnbqkb1r/ppp2ppp/8/4p3/2Pn4/5N2/PP3PPP/RNBQKB1R w KQkq -': ['f3d4', 'd1d4', 'b1c3'],
  'rnbqkb1r/ppp2ppp/8/4N3/2Pn4/8/PP3PPP/RNBQKB1R b KQkq -': ['d8e7', 'd8d5', 'd4c2'],
  'rnbqkb1r/ppp2ppp/8/4N3/2P5/8/PP3PPP/RNBQKB1R b KQkq -': ['d4c2', 'd4b3'],
};


const MATE_UPPER = pieceValues.k + 10 * pieceValues.q;

export const evaluateBoard = (game: Chess): number => {
  if (game.isCheckmate()) {
    return game.turn() === 'w' ? -MATE_UPPER : MATE_UPPER;
  }
  if (game.isDraw() || game.isStalemate()) {
    return 0;
  }
  
  // Determine game phase (simplified approach)
  const board = game.board();
  let totalPieces = 0;
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (board[i][j]) totalPieces++;
    }
  }
  
  // Phase calculation (32 pieces at start, fewer than 10 can be considered endgame)
  // 1.0 = middlegame, 0.0 = endgame
  const phase = Math.min(1.0, Math.max(0.0, (totalPieces - 10) / 22));
  
  let score = 0;
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const piece = board[i][j];
      if (!piece) continue;
      
      const materialValue = pieceValues[piece.type];
      const squareIndex = (7 - i) * 8 + j;
      
      // For black pieces, mirror the square index vertically
      const adjustedSquareIndex = piece.color === 'w' ? squareIndex : 63 - squareIndex;
      
      // Blend between middlegame and endgame values based on the phase
      const positionValue = 
        phase * pst[piece.type].mg[adjustedSquareIndex] + 
        (1 - phase) * pst[piece.type].eg[adjustedSquareIndex];
      
      const value = materialValue + positionValue;
      score += piece.color === 'w' ? value : -value;
    }
  }
  
  return score;
};

const search = (game: Chess, depth: number, alpha: number, beta: number, isMaximizing: boolean): number => {
  if (depth === 0 || game.isGameOver()) {
    return evaluateBoard(game);
  }
  const moves = game.moves({ verbose: true });
  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of moves) {
      game.move(move);
      const evaluation = search(game, depth - 1, alpha, beta, false);
      game.undo();
      maxEval = Math.max(maxEval, evaluation);
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      game.move(move);
      const evaluation = search(game, depth - 1, alpha, beta, true);
      game.undo();
      minEval = Math.min(minEval, evaluation);
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) break;
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
  const fenKey = fen.split(' ').slice(0, 4).join(' ');
  if (openingBook[fenKey]) {
    const bookMoves = openingBook[fenKey];
    const legalBookMoves = bookMoves.filter(move =>
      moves.some(m => m.from === move.substring(0, 2) && m.to === move.substring(2, 4))
    );
    if (legalBookMoves.length > 0) {
      const useBookMove = Math.random() > 0.2;
      if (useBookMove || difficulty === 'easy') {
        const randomBookMove = legalBookMoves[
          Math.floor(Math.random() * legalBookMoves.length)
        ];
        return randomBookMove;
      }
    }
  }
  const searchDepth = difficulty === 'easy' ? 2 : difficulty === 'medium' ? 3 : 4;
  const delay = difficulty === 'easy' ? 100 : difficulty === 'medium' ? 300 : 500;
  await new Promise(resolve => setTimeout(resolve, delay));
  let bestMove = null;
  let bestEval = game.turn() === 'w' ? -Infinity : Infinity;
  const isMaximizing = game.turn() === 'w';
  let alpha = -Infinity;
  let beta = Infinity;
  for (const move of moves) {
    game.move(move);
    const evaluation = search(game, searchDepth - 1, alpha, beta, !isMaximizing);
    game.undo();
    if ((isMaximizing && evaluation > bestEval) || (!isMaximizing && evaluation < bestEval)) {
      bestEval = evaluation;
      bestMove = move;
    }
    if (isMaximizing) {
      alpha = Math.max(alpha, bestEval);
    } else {
      beta = Math.min(beta, bestEval);
    }
    if (beta <= alpha) break;
  }
  if (difficulty === 'easy' && Math.random() < 0.3) {
    const randomIndex = Math.floor(Math.random() * moves.length);
    bestMove = moves[randomIndex];
  }
  if (!bestMove) {
    bestMove = moves[Math.floor(Math.random() * moves.length)];
  }
  return bestMove ? `${bestMove.from}${bestMove.to}${bestMove.promotion || ''}` : '';
};
