import React, { useCallback } from 'react';
import { Chessboard as ReactChessboard } from 'react-chessboard';
import { useGameStore } from '../store/gameStore';
import { calculateBestMove } from '../utils/engine';
import { Square, Move } from 'chess.js';
import { GameResult } from '../types/chess';

export const Chessboard: React.FC = () => {
  const { 
    game, 
    mode, 
    difficulty, 
    theme, 
    isThinking, 
    makeMove, 
    setThinking,
    gameResult
  } = useGameStore();

  const onDrop = useCallback(
    (sourceSquare: Square, targetSquare: Square) => {
      try {
        // Don't allow moves when game is over
        if (gameResult) return false;

        // Get all legal moves for the selected piece
        const legalMoves = game.moves({ square: sourceSquare, verbose: true }) as Move[];

        // Ensure the move is legal
        const isLegalMove = legalMoves.some(move => move.from === sourceSquare && move.to === targetSquare);
        if (!isLegalMove) return false;

        // Make the move
        const move = game.move({ from: sourceSquare, to: targetSquare, promotion: 'q' });
        if (!move) return false;

        makeMove(`${move.from}${move.to}`);

        // If single-player mode, let the engine play
        if (mode === 'single' && !game.isGameOver()) {
          setThinking(true);
          setTimeout(async () => {
            const bestMove = await calculateBestMove(game.fen(), difficulty);
            if (bestMove) makeMove(bestMove);
            setThinking(false);
          }, 300);
        }

        return true;
      } catch (error) {
        console.error('Error making move:', error);
        return false;
      }
    },
    [game, mode, difficulty, makeMove, setThinking, gameResult]
  );

  // Determine game end state
  const isGameOver = game.isGameOver() || !!gameResult;
  const isCheckmate = game.isCheckmate();
  const isStalemate = game.isStalemate();
  const isDraw = game.isDraw() && !isStalemate;

  // Get the message to display based on game state
  const getGameEndMessage = () => {
    if (gameResult) {
      const winner = gameResult.winner === 'w' ? 'White' : gameResult.winner === 'b' ? 'Black' : 'Nobody';
      return `${winner} wins by ${gameResult.reason}`;
    }
    if (isCheckmate) {
      return `Checkmate! ${game.turn() === 'w' ? 'Black' : 'White'} wins`;
    } else if (isStalemate) {
      return 'Stalemate - Game drawn';
    } else if (isDraw) {
      return 'Draw';
    }
    return '';
  };

  return (
    <div className="w-[600px] h-[600px] relative">
      <ReactChessboard
        position={game.fen()}
        onPieceDrop={onDrop}
        customBoardStyle={{
          borderRadius: '4px',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        }}
        customDarkSquareStyle={{ backgroundColor: theme === 'dark' ? '#1e293b' : '#b7c0d8' }}
        customLightSquareStyle={{ backgroundColor: theme === 'dark' ? '#334155' : '#e2e8f0' }}
      />
      {isThinking && (
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <div className="text-white text-xl font-semibold">Thinking...</div>
        </div>
      )}
      {isGameOver && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg text-center max-w-xs">
            <h3 className={`text-2xl font-bold mb-2 ${isCheckmate ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'}`}>
              {getGameEndMessage()}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {isCheckmate ? 'The king is in check and has no legal moves.' : 
               isStalemate ? 'No legal moves available, but the king is not in check.' : 
               'Game ended in a draw.'}
            </p>
            <button 
              className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-600 transition-colors"
              onClick={() => window.location.reload()}
            >
              New Game
            </button>
          </div>
        </div>
      )}
    </div>
  );
};