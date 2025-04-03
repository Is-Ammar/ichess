import React, { useCallback } from 'react';
import { Chessboard as ReactChessboard } from 'react-chessboard';
import { useGameStore } from '../store/gameStore';
import { Square } from 'chess.js';

export const Chessboard: React.FC = () => {
  const { 
    game, 
    mode, 
    theme, 
    isThinking, 
    makeMove,
    gameResult,
    playerColor
  } = useGameStore();

  const onDrop = useCallback(
    (sourceSquare: Square, targetSquare: Square) => {
      try {
        if (gameResult || isThinking) return false;

        if (mode === 'single' && game.turn() !== playerColor) return false;
        const piece = game.get(sourceSquare);
        const isPromotion = 
          piece && 
          piece.type === 'p' && 
          ((piece.color === 'w' && targetSquare.charAt(1) === '8') || 
           (piece.color === 'b' && targetSquare.charAt(1) === '1'));

        const promotion = isPromotion ? 'q' : undefined;
  
        makeMove({ from: sourceSquare, to: targetSquare, promotion });
        return true;
      } catch (error) {
        console.error('Error making move:', error);
        return false;
      }
    },
    [game, mode, makeMove, gameResult, isThinking, playerColor]
  );

  const boardOrientation = mode === 'single' ? 
    (playerColor === 'w' ? 'white' : 'black') : 
    'white';

  return (
    <div className="w-[600px] h-[600px] relative">
      <ReactChessboard
        position={game.fen()}
        onPieceDrop={onDrop}
        boardOrientation={boardOrientation}
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
      {gameResult && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg text-center max-w-xs">
            <h3 className="text-2xl font-bold mb-2 text-blue-600 dark:text-blue-400">
              {gameResult.winner === 'w' ? 'White' : gameResult.winner === 'b' ? 'Black' : 'Nobody'} wins by {gameResult.reason}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {gameResult.reason === 'checkmate' ? 'The king is in check and has no legal moves.' : 
               gameResult.reason === 'stalemate' ? 'No legal moves available, but the king is not in check.' : 
               gameResult.reason === 'resignation' ? 'Player resigned the game.' :
               gameResult.reason === 'agreement' ? 'Draw agreed by both players.' :
               'Game ended in a draw.'}
            </p>
            <button 
              className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-600 transition-colors"
              onClick={() => useGameStore.getState().resetGame()}
            >
              New Game
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
