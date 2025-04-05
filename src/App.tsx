import { useState, useEffect } from 'react';
import { Chessboard } from './components/Chessboard';
import { Sidebar } from './components/Sidebar';
import { TimeControlSelector } from './components/TimeControlSelector';
import { useGameStore } from './store/gameStore';
import { Menu, X } from 'lucide-react';

function App() {
  const theme = useGameStore((state) => state.theme);
  const [showSetup, setShowSetup] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { message } = useGameStore();

  const handleStartGame = () => {
    setShowSetup(false);
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-900' : 'bg-slate-100'} transition-colors duration-300`}>
      {!showSetup && isMobile && (
        <div className={`lg:hidden fixed top-0 left-0 right-0 z-40 ${
          theme === 'dark' ? 'bg-slate-800' : 'bg-white'
        } shadow-md p-4 flex justify-between items-center`}>
          <h1 className="text-xl font-bold">Chess-Me</h1>
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            {showSidebar ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      )}

      <div className={`container mx-auto py-8 ${!showSetup && isMobile ? 'pt-20' : ''}`}>
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
          <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
            <div className={`w-full ${isMobile ? 'order-2' : ''}`}>
              <Chessboard />
            </div>

            <div className={`
              ${isMobile ? 
                `fixed top-16 right-0 bottom-0 z-30 w-72 p-4 overflow-y-auto transition-transform duration-300 ease-in-out ${
                  theme === 'dark' ? 'bg-slate-800' : 'bg-white'
                } shadow-xl ${showSidebar ? 'translate-x-0' : 'translate-x-full'}` 
                : 'w-80 relative'} 
              ${isMobile ? '' : 'lg:block'}
            `}>
              <Sidebar />
            </div>
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
      {showSidebar && isMobile && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}
    </div>
  );
}

export default App;