import { useState } from 'react';
import { Chessboard } from './components/Chessboard';
import { Sidebar } from './components/Sidebar';
import { TimeControlSelector } from './components/TimeControlSelector';
import { useGameStore } from './store/gameStore';

function App() {
  const theme = useGameStore((state) => state.theme);
  const [showSetup, setShowSetup] = useState(true);

  const handleStartGame = () => {
    setShowSetup(false);
  };

  const { message} = useGameStore();


  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-900' : 'bg-slate-100'} transition-colors duration-300`}>
      <div className="container mx-auto py-8">
        {showSetup ? (
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-center mb-8">Chess Game Setup</h1>
            
            <div className="space-y-6">
              <TimeControlSelector />
              
              <div className="text-center mt-8">
                <button 
                  onClick={handleStartGame}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition-colors"
                >
                  Start Game
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex gap-8 items-start justify-center">
            <Chessboard />
            <Sidebar />
          </div>
        )}
      </div>
 
      {message && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className={`
            px-6 py-4 
            rounded-lg shadow-lg 
            text-lg font-medium text-white
            ${message.includes('accepted') ? 'bg-green-600' : 'bg-red-600'} 
            opacity-90 
            animate-fadeIn
          `}>
            {message}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;