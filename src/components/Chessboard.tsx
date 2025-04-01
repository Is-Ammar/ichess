import React, { useCallback } from 'react';
import { Chessboard as ReactChessboard } from 'react-chessboard';
import { useGameStore } from '../store/gameStore';
import { calculateBestMove } from '../utils/engine';
import { Square, Move } from 'chess.js';

// Helper function to get piece icon
const getPieceIcon = (piece: string) => {
  const pieceMap: Record<string, string> = {
    'p': '♟︎',
    'n': '♞',
    'b': '♝',
    'r': '♜',
    'q': '♛',
    'k': '♚',
    'P': '♙',
    'N': '♘',
    'B': '♗',
    'R': '♖',
    'Q': '♕',
    'K': '♔'
  };
  return pieceMap[piece] || '';
};

export const Chessboard: React.FC = () => {
  const { 
    game, 
    mode, 
    difficulty, 
    theme, 
    isThinking, 
    makeMove, 
    setThinking,
    gameResult,
    playerColor
  } = useGameStore();

  // Function to get captured pieces
  const getCapturedPieces = useCallback(() => {
    const capturedPieces: { white: string[], black: string[] } = { white: [], black: [] };
    
    // Calculate initial pieces counts
    const initialPieces = {
      white: { p: 8, n: 2, b: 2, r: 2, q: 1, k: 1 },
      black: { p: 8, n: 2, b: 2, r: 2, q: 1, k: 1 }
    };

    // Count current pieces on board
    const currentPieces: Record<string, number> = {};
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const square = String.fromCharCode(97 + j) + (8 - i) as Square;
        const piece = game.get(square);
        if (piece) {
          const key = `${piece.type}${piece.color}`;
          currentPieces[key] = (currentPieces[key] || 0) + 1;
        }
      }
    }

    // Calculate captured pieces by comparing initial with current
    (['white', 'black'] as const).forEach(color => {
      (['p', 'n', 'b', 'r', 'q', 'k'] as const).forEach(type => {
        const colorPrefix = color === 'white' ? 'w' : 'b';
        const currentCount = currentPieces[`${type}${colorPrefix}`] || 0;
        const initialCount = initialPieces[color][type];
        const diff = initialCount - currentCount;
        
        if (diff > 0) {
          const pieceCode = color === 'white' ? type.toUpperCase() : type;
          const opponentColor = color === 'white' ? 'black' : 'white';
          for (let i = 0; i < diff; i++) {
            capturedPieces[opponentColor].push(pieceCode);
          }
        }
      });
    });

    return capturedPieces;
  }, [game]);

  const capturedPieces = getCapturedPieces();

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

  // Determine board orientation based on player color in single player mode
  const boardOrientation = mode === 'single' ? 
    (playerColor === 'w' ? 'white' : 'black') : 
    'white';

  return (
    <div className="flex flex-col">
      {/* Captured pieces by black (displayed above board) */}
      <div className="flex flex-wrap justify-center items-center bg-slate-200 dark:bg-slate-700 p-2 mb-2 rounded min-h-[40px]">
        {capturedPieces.black.map((piece, index) => (
          <span key={`white-captured-${index}`} className="text-2xl mx-0.5">
            {getPieceIcon(piece)}
          </span>
        ))}
      </div>

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

      {/* Captured pieces by white (displayed below board) */}
      <div className="flex flex-wrap justify-center items-center bg-slate-200 dark:bg-slate-700 p-2 mt-2 rounded min-h-[40px]">
        {capturedPieces.white.map((piece, index) => (
          <span key={`black-captured-${index}`} className="text-2xl mx-0.5">
            {getPieceIcon(piece)}
          </span>
        ))}
      </div>
    </div>
  );
};