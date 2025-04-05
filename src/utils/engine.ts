import { Chess } from 'chess.js';
import { Difficulty } from '../types/chess';

const pieceValues = {
  p: 100,
  n: 325,
  b: 335,
  r: 500,
  q: 975,
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

const openingBook: Record<string, string[]> = {
  'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -': ['e2e4', 'd2d4', 'g1f3', 'c2c4', 'b2b3', 'g2g3'],
  'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq -': ['e7e5', 'c7c5', 'e7e6', 'c7c6', 'd7d5', 'g8f6', 'd7d6', 'b7b6'],
  'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq -': ['g1f3', 'f1c4', 'f2f4', 'b1c3', 'd2d4'],
  'rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq -': ['b8c6', 'g8f6', 'd7d6', 'f7f5'],
  'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq -': ['f1b5', 'd2d4', 'f1c4', 'b1c3', 'c2c3', 'd2d3'],
  'r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq -': ['a7a6', 'g8f6', 'd7d6', 'f7f5', 'g8e7'],
  'r1bqkbnr/1ppp1ppp/p1n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq -': ['b5a4', 'b5c6', 'e1g1', 'c2c3', 'd2d4'],
  'r1bqkbnr/1ppp1ppp/p1n5/4p3/B3P3/5N2/PPPP1PPP/RNBQK2R b KQkq -': ['b7b5', 'd7d6', 'g8f6', 'f7f5'],
  'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq -': ['g8f6', 'f8c5', 'f7f5', 'd7d6', 'b8a6'],
  'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq -': ['d2d4', 'd2d3', 'b1c3', 'e1g1', 'c2c3'],
  'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq -': ['g1f3', 'b1c3', 'c2c3', 'd2d4', 'f2f4', 'c2c4'],
  'rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq -': ['d7d6', 'b8c6', 'e7e6', 'a7a6', 'g8f6'],
  'rnbqkbnr/pp2pppp/3p4/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq -': ['d2d4', 'c2c4', 'f1c4', 'b1c3', 'c2c3'],
  'rnbqkbnr/pp2pppp/3p4/2p5/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq -': ['c5d4', 'g8f6', 'e7e5', 'g7g6'],
  'rnbqkbnr/ppp2ppp/4p3/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq -': ['e4d5', 'e4e5', 'd2d4', 'b1c3', 'g1f3'],
  'rnbqkbnr/ppp2ppp/4p3/3pP3/8/8/PPPP1PPP/RNBQKBNR b KQkq -': ['d5d4', 'c7c5', 'f7f6', 'f7f5'],
  'rnbqkbnr/ppp2ppp/4p3/3p4/3PP3/8/PPP2PPP/RNBQKBNR b KQkq -': ['d5e4', 'f8e7', 'c7c5', 'b8c6', 'g8f6'],
  'rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq -': ['d2d4', 'b1c3', 'g1f3', 'c2c4', 'd2d3'],
  'rnbqkbnr/pp1ppppp/2p5/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq -': ['d7d5', 'g7g6', 'e7e6', 'd7d6']
};

const MATE_UPPER = pieceValues.k + 10 * pieceValues.q;

export const evaluateBoard = (game: Chess): number => {
  if (game.isCheckmate()) {
    return game.turn() === 'w' ? -MATE_UPPER : MATE_UPPER;
  }
  if (game.isDraw() || game.isStalemate()) {
    return 0;
  }

  const board = game.board();
  let totalPieces = 0;
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (board[i][j]) totalPieces++;
    }
  }

  const phase = Math.min(1.0, Math.max(0.0, (totalPieces - 10) / 22));

  let score = 0;
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const piece = board[i][j];
      if (!piece) continue;

      const materialValue = pieceValues[piece.type];
      const squareIndex = (7 - i) * 8 + j;

      const adjustedSquareIndex = piece.color === 'w' ? squareIndex : 63 - squareIndex;

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
  const searchDepth = difficulty === 'easy' ? 2 : difficulty === 'medium' ? 4 : 4;
  const delay = difficulty === 'easy' ? 100 : difficulty === 'medium' ? 400 : 500;
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
