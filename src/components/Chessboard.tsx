import React, { useCallback, useEffect, useState } from 'react';
import { Chessboard as ReactChessboard } from 'react-chessboard';
import { useGameStore } from '../store/gameStore';
import { Square } from 'chess.js';

type CapturedPieces = {
  w: { p: number; n: number; b: number; r: number; q: number };
  b: { p: number; n: number; b: number; r: number; q: number };
};

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
  
  const [boardSize, setBoardSize] = useState(600);
  const [capturedPieces, setCapturedPieces] = useState<CapturedPieces>({
    w: { p: 0, n: 0, b: 0, r: 0, q: 0 },
    b: { p: 0, n: 0, b: 0, r: 0, q: 0 }
  });
  // Add state for the selected piece and its legal moves
  const [selectedPiece, setSelectedPiece] = useState<Square | null>(null);
  const [legalMoves, setLegalMoves] = useState<Square[]>([]);

  useEffect(() => {
    const handleResize = () => {
      const maxWidth = window.innerWidth * 0.8;
      const maxHeight = window.innerHeight * 0.8;
      const size = Math.min(maxWidth, maxHeight, 600);
      setBoardSize(size);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const calculateCapturedPieces = () => {
      const startingPieces = {
        w: { p: 8, n: 2, b: 2, r: 2, q: 1 },
        b: { p: 8, n: 2, b: 2, r: 2, q: 1 }
      };
      
      const currentPieces = {
        w: { p: 0, n: 0, b: 0, r: 0, q: 0 },
        b: { p: 0, n: 0, b: 0, r: 0, q: 0 }
      };
      
      const board = game.board();
      
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          const piece = board[i][j];
          if (piece && piece.type !== 'k') { 
            currentPieces[piece.color][piece.type]++;
          }
        }
      }
      
      const captured = {
        w: { p: startingPieces.w.p - currentPieces.w.p, 
             n: startingPieces.w.n - currentPieces.w.n,
             b: startingPieces.w.b - currentPieces.w.b, 
             r: startingPieces.w.r - currentPieces.w.r, 
             q: startingPieces.w.q - currentPieces.w.q },
        b: { p: startingPieces.b.p - currentPieces.b.p, 
             n: startingPieces.b.n - currentPieces.b.n,
             b: startingPieces.b.b - currentPieces.b.b, 
             r: startingPieces.b.r - currentPieces.b.r, 
             q: startingPieces.b.q - currentPieces.b.q }
      };
      
      setCapturedPieces(captured);
    };
    
    calculateCapturedPieces();
 
    setSelectedPiece(null);
    setLegalMoves([]);
  }, [game]);

  const onSquareClick = (square: Square) => {
    if (gameResult || isThinking) return;

    if (mode === 'single' && game.turn() !== playerColor) return;

    const piece = game.get(square);
   
    if (selectedPiece) {

      if (legalMoves.includes(square)) {
        const isPromotion = 
          game.get(selectedPiece)?.type === 'p' && 
          ((game.get(selectedPiece)?.color === 'w' && square.charAt(1) === '8') || 
           (game.get(selectedPiece)?.color === 'b' && square.charAt(1) === '1'));

        const promotion = isPromotion ? 'q' : undefined;

        makeMove({ from: selectedPiece, to: square, promotion });
      }
 
      setSelectedPiece(null);
      setLegalMoves([]);
      return;
    }
    
    if (piece && piece.color === game.turn()) {
      setSelectedPiece(square);

      const moves = game.moves({ square, verbose: true });
      setLegalMoves(moves.map(move => move.to));
    }
  };

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

  const renderPiece = (type: string, color: 'w' | 'b', count: number) => {
    if (count <= 0) return null;

    const pieceSymbols = {
      w: {
        p: '♙',
        n: '♘',
        b: '♗',
        r: '♖',
        q: '♕'
      },
      b: {
        p: '♟︎',
        n: '♞',
        b: '♝',
        r: '♜',
        q: '♛'
      }
    };

    const pieceValues = {
      p: 1,
      n: 3,
      b: 3,
      r: 5,
      q: 9
    };

    const pieceSize = Math.max(16, boardSize * 0.04);
    const pieceMargin = Math.max(2, boardSize * 0.005);

    const pieces = [];
    for (let i = 0; i < count; i++) {
      pieces.push(
        <div 
          key={`${color}-${type}-${i}`}
          className={`
            inline-flex items-center justify-center
            ${color === 'w' ? 'bg-gray-100' : 'bg-gray-800'} 
            ${color === 'w' ? 'text-gray-800' : 'text-gray-100'} 
            rounded-full shadow-md
            ${pieceValues[type as keyof typeof pieceValues] >= 5 ? 'animate-pulse' : ''}
            transform hover:scale-110 transition-transform
          `}
          style={{
            width: `${pieceSize}px`,
            height: `${pieceSize}px`,
            fontSize: `${pieceSize * 0.7}px`,
            margin: `${pieceMargin}px`,
            textShadow: color === 'w' ? '0 0 1px #000' : '0 0 1px #fff'
          }}
          title={`${color === 'w' ? 'White' : 'Black'} ${
            type === 'p' ? 'Pawn' : 
            type === 'n' ? 'Knight' : 
            type === 'b' ? 'Bishop' : 
            type === 'r' ? 'Rook' : 'Queen'
          }`}
        >
          {pieceSymbols[color][type as keyof typeof pieceSymbols[typeof color]]}
        </div>
      );
    }
    
    return pieces;
  };

  const calculateAdvantage = () => {
    const pieceValues = { p: 1, n: 3, b: 3, r: 5, q: 9 };
    const whiteCaptured = 
      capturedPieces.b.p * pieceValues.p + 
      capturedPieces.b.n * pieceValues.n + 
      capturedPieces.b.b * pieceValues.b + 
      capturedPieces.b.r * pieceValues.r + 
      capturedPieces.b.q * pieceValues.q;
    
    const blackCaptured = 
      capturedPieces.w.p * pieceValues.p + 
      capturedPieces.w.n * pieceValues.n + 
      capturedPieces.w.b * pieceValues.b + 
      capturedPieces.w.r * pieceValues.r + 
      capturedPieces.w.q * pieceValues.q;
    
    const advantage = whiteCaptured - blackCaptured;
    
    if (advantage === 0) return null;
    
    return (
      <div className={`text-sm font-bold ${advantage > 0 ? 'text-green-500' : 'text-red-500'}`}>
        {advantage > 0 ? `+${advantage}` : advantage}
      </div>
    );
  };

  const capturedPiecesWidth = Math.max(40, boardSize * 0.1);

  const customSquareStyles: Record<string, Record<string, string | number>> = {};

  legalMoves.forEach((square) => {
    const targetPiece = game.get(square);
   
    if (targetPiece) {

      customSquareStyles[square] = {
        background: 'radial-gradient(transparent 0%, transparent 79%, rgba(255,0,0,0.3) 80%)',
        borderRadius: '50%'
      };
    } else {
  
      customSquareStyles[square] = {
        background: 'radial-gradient(rgba(0,0,0,0.1) 25%, rgba(0,0,0,0) 26%)',
        borderRadius: '50%'
      };
    }
  });
  

  if (selectedPiece) {
    customSquareStyles[selectedPiece] = {
      background: 'rgba(255, 255, 0, 0.4)'
    };
  }

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center p-2 gap-2">
      <div className={`lg:hidden w-full max-w-[${boardSize}px] h-[${capturedPiecesWidth}px] bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-500 p-2 rounded-md flex flex-row items-center justify-center gap-1 overflow-x-auto`}>
        <div className="text-sm font-semibold mr-2 text-center text-slate-600 dark:text-slate-300">
          White
        </div>
        {renderPiece('q', 'w', capturedPieces.w.q)}
        {renderPiece('r', 'w', capturedPieces.w.r)}
        {renderPiece('b', 'w', capturedPieces.w.b)}
        {renderPiece('n', 'w', capturedPieces.w.n)}
        {renderPiece('p', 'w', capturedPieces.w.p)}
        {Object.values(capturedPieces.w).every(count => count === 0) && (
          <span className="text-slate-600 dark:text-slate-300 italic text-xs text-center">None</span>
        )}
      </div>

      <div className="flex flex-row items-center justify-center gap-2">
        <div className={`hidden lg:flex h-[${boardSize}px] w-[${capturedPiecesWidth}px] bg-gradient-to-b from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-500 p-2 rounded-md flex-col items-center justify-start gap-1 overflow-y-auto`}>
          <div className="text-sm font-semibold mb-2 text-center text-slate-600 dark:text-slate-300">
            Captured White
          </div>
          {renderPiece('q', 'w', capturedPieces.w.q)}
          {renderPiece('r', 'w', capturedPieces.w.r)}
          {renderPiece('b', 'w', capturedPieces.w.b)}
          {renderPiece('n', 'w', capturedPieces.w.n)}
          {renderPiece('p', 'w', capturedPieces.w.p)}
          {Object.values(capturedPieces.w).every(count => count === 0) && (
            <span className="text-slate-600 dark:text-slate-300 italic text-xs text-center mt-4">None</span>
          )}
          <div className="mt-auto">
            {calculateAdvantage()}
          </div>
        </div>
        <div className={`w-[${boardSize}px] h-[${boardSize}px] relative`}>
          <ReactChessboard
            position={game.fen()}
            onPieceDrop={onDrop}
            onSquareClick={onSquareClick}
            boardOrientation={boardOrientation}
            boardWidth={boardSize}
            customBoardStyle={{
              borderRadius: '4px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            }}
            customSquareStyles={customSquareStyles}
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

        <div className={`hidden lg:flex h-[${boardSize}px] w-[${capturedPiecesWidth}px] bg-gradient-to-b from-slate-700 to-slate-600 p-2 rounded-md flex-col items-center justify-start gap-1 overflow-y-auto`}>
          <div className="text-sm font-semibold mb-2 text-center text-slate-300">
            Captured Black
          </div>
          {renderPiece('q', 'b', capturedPieces.b.q)}
          {renderPiece('r', 'b', capturedPieces.b.r)}
          {renderPiece('b', 'b', capturedPieces.b.b)}
          {renderPiece('n', 'b', capturedPieces.b.n)}
          {renderPiece('p', 'b', capturedPieces.b.p)}
          {Object.values(capturedPieces.b).every(count => count === 0) && (
            <span className="text-slate-300 italic text-xs text-center mt-4">None</span>
          )}
        </div>
      </div>

      <div className={`lg:hidden w-full max-w-[${boardSize}px] h-[${capturedPiecesWidth}px] bg-gradient-to-r from-slate-700 to-slate-600 p-2 rounded-md flex flex-row items-center justify-center gap-1 overflow-x-auto`}>
        <div className="text-sm font-semibold mr-2 text-center text-slate-300">
          Black
        </div>
        {renderPiece('q', 'b', capturedPieces.b.q)}
        {renderPiece('r', 'b', capturedPieces.b.r)}
        {renderPiece('b', 'b', capturedPieces.b.b)}
        {renderPiece('n', 'b', capturedPieces.b.n)}
        {renderPiece('p', 'b', capturedPieces.b.p)}
        {Object.values(capturedPieces.b).every(count => count === 0) && (
          <span className="text-slate-300 italic text-xs text-center">None</span>
        )}
      </div>

      <div className="lg:hidden">
        {calculateAdvantage()}
      </div>
    </div>
  );
};