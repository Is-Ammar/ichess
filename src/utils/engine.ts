import { Chess } from 'chess.js';
import { Difficulty } from '../types/chess';

const pieceValues = {
  p: 100,
  n: 280,
  b: 320,
  r: 479,
  q: 929,
  k: 60000,
};

const pst: Record<string, number[]> = {
  p: [
    0, 0, 0, 0, 0, 0, 0, 0, 78, 83, 86, 73, 102, 82, 85, 90, 7, 29, 21, 44, 40, 31, 44, 7, -17, 16, -2, 15, 14, 0, 15, -13, -26, 3, 10, 9, 6, 1, 0, -23, -22, 9, 5, -11, -10, -2, 3, -19, -31, 8, -7, -37, -36, -14, 3, -31, 0, 0, 0, 0, 0, 0, 0, 0
  ],
  n: [
    -66, -53, -75, -75, -10, -55, -58, -70, -3, -6, 100, -36, 4, 62, -4, -14, 10, 67, 1, 74, 73, 27, 62, -2, 24, 24, 45, 37, 33, 41, 25, 17, -1, 5, 31, 21, 22, 35, 2, 0, -18, 10, 13, 22, 18, 15, 11, -14, -23, -15, 2, 0, 2, 0, -23, -20, -74, -23, -26, -24, -19, -35, -22, -69
  ],
  b: [
    -59, -78, -82, -76, -23, -107, -37, -50, -11, 20, 35, -42, -39, 31, 2, -22, -9, 39, -32, 41, 52, -10, 28, -14, 25, 17, 20, 34, 26, 25, 15, 10, 13, 10, 17, 23, 17, 16, 0, 7, 14, 25, 24, 15, 8, 25, 20, 15, 19, 20, 11, 6, 7, 6, 20, 16, -7, 2, -15, -12, -14, -15, -10, -10
  ],
  r: [
    35, 29, 33, 4, 37, 33, 56, 50, 55, 29, 56, 67, 55, 62, 34, 60, 19, 35, 28, 33, 45, 27, 25, 15, 0, 5, 16, 13, 18, -4, -9, -6, -28, -35, -16, -21, -13, -29, -46, -30, -42, -28, -42, -25, -25, -35, -26, -46, -53, -38, -31, -26, -29, -43, -44, -53, -30, -24, -18, 5, -2, -18, -31, -32
  ],
  q: [
    6, 1, -8, -104, 69, 24, 88, 26, 14, 32, 60, -10, 20, 76, 57, 24, -2, 43, 32, 60, 72, 63, 43, 2, 1, -16, 22, 17, 25, 20, -13, -6, -14, -15, -2, -5, -1, -10, -20, -22, -30, -6, -13, -11, -16, -11, -16, -27, -36, -18, 0, -19, -15, -15, -21, -38, -39, -30, -31, -13, -31, -36, -34, -42
  ],
  k: [
    4, 54, 47, -99, -99, 60, 83, -62, -32, 10, 55, 56, 56, 55, 10, 3, -62, 12, -57, 44, -67, 28, 37, -31, -55, 50, 11, -4, -19, 13, 0, -49, -55, -43, -52, -28, -51, -47, -8, -50, -47, -42, -43, -79, -64, -32, -29, -32, -4, 3, -14, -50, -57, -18, 13, 4, 17, 30, -3, -14, 6, -1, 40, 18
  ]
};

const MATE_UPPER = pieceValues.k + 10 * pieceValues.q;

const openingBook: Record<string, string[]> = {
  'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -': ['e2e4', 'd2d4', 'g1f3', 'c2c4', 'b2b3', 'g2g3'],
  'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq -': ['e7e5', 'c7c5', 'e7e6', 'c7c6', 'g8f6', 'd7d5'],
  'rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq -': ['g8f6', 'd7d5', 'e7e6', 'c7c5', 'f7f5', 'g7g6'],
  'rnbqkbnr/pppp1ppp/5n2/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq -': ['g1f3', 'f2f4', 'b1c3', 'd2d4'],
  'rnbqkb1r/pppp1ppp/5n2/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq -': ['b8c6', 'd7d6', 'f7f5'],
  'rnbqkb1r/pppp1ppp/5n2/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq -': ['f1b5', 'f1c4', 'd2d4'],
  'rnbqkb1r/pppp1ppp/5n2/4p3/4P3/5N2/PPPP1PPP/RNBQKBR1 b KQkq -': ['a7a6', 'd7d6', 'g8f6'],
  'rnbqkb1r/1ppp1ppp/p4n2/4p3/4P3/5N2/PPPP1PPP/RNBQKBR1 w KQkq -': ['a4a4', 'a4c4'],
  'rnbqkb1r/1ppp1ppp/p4n2/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq -': ['g8f6', 'b7b5', 'd7d6'],
  'rnbqkbnr/pp1ppppp/5n2/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq -': ['g1f3', 'c2c3', 'b1c3', 'd2d4'],
  'rnbqkbnr/pp1ppppp/5n2/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq -': ['d7d6', 'b8c6', 'e7e6'],
  'rnbqkbnr/pp2pppp/5n2/2pp4/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq -': ['d2d4'],
  'rnbqkbnr/pp2pppp/5n2/5N2/4p3/5N2/PPPP1PPP/RNBQKB1R b KQkq -': ['g8f6'],
  'rnbqkb1r/pp2pppp/5n2/5N2/4p3/5N2/PPPP1PPP/RNBQKB1R w KQkq -': ['b1c3'],
  'rnbqkb1r/pp2pppp/5n2/5N2/4p3/2N2N2/PPPP1PPP/RNBQKB1R b KQkq -': ['a7a6', 'e7e6'],
  'rnbqkbnr/ppp1pppp/5n2/5p2/3P4/5N2/PPP1PPPP/RNBQKB1R w KQkq -': ['c2c4', 'g1f3', 'e2e3'],
  'rnbqkbnr/ppp1pppp/5n2/5p2/2PP4/5N2/PP1P1PPP/RNBQKB1R b KQkq -': ['e7e6', 'd5c4', 'c7c6'],
  'rnbqkbnr/pp1p1ppp/5n2/4pp2/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq -': ['d2d4', 'e4e5', 'b1c3'],
  'rnbqkbnr/pp1p1ppp/5n2/4pp2/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq -': ['d7d5'],
  'rnbqkbnr/pp3ppp/5n2/4pp2/3PP3/5N2/PPP2PPP/RNBQKB1R w KQkq -': ['e4e5', 'e4d5', 'b1c3']
};

export const evaluateBoard = (game: Chess): number => {
  if (game.isCheckmate()) {
    return game.turn() === 'w' ? -MATE_UPPER : MATE_UPPER;
  }
  if (game.isDraw() || game.isStalemate()) {
    return 0;
  }
  let score = 0;
  const board = game.board();
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const piece = board[i][j];
      if (!piece) continue;
      const materialValue = pieceValues[piece.type];
      const squareIndex = (7 - i) * 8 + j;
      const positionValue = pst[piece.type][squareIndex];
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