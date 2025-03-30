import React, { useCallback } from 'react';
import { Chessboard as ReactChessboard } from 'react-chessboard';
import { useGameStore } from '../store/gameStore';
import { calculateBestMove } from '../utils/engine';
import { Square, Move } from 'chess.js';

export const Chessboard: React.FC = () => {
  const { game, mode, difficulty, theme, isThinking, makeMove, setThinking } = useGameStore();

  const onDrop = useCallback(
    (sourceSquare: Square, targetSquare: Square) => {
      try {
        // Get all legal moves for the selected piece
        const legalMoves = game.moves({ square: sourceSquare, verbose: true }) as Move[];

        // Ensure the move is legal
        const isLegalMove = legalMoves.some(move => move.from === sourceSquare && move.to === targetSquare);
        if (!isLegalMove) return false;

        // Make the move
        const move = game.move({ from: sourceSquare, to: targetSquare, promotion: 'q' }); // Promote to queen by default
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
    [game, mode, difficulty, makeMove, setThinking]
  );

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
    </div>
  );
};
