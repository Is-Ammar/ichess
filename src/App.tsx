import React from 'react';
import { Chessboard } from './components/Chessboard';
import { Sidebar } from './components/Sidebar';
import { useGameStore } from './store/gameStore';

function App() {
  const theme = useGameStore((state) => state.theme);

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-900' : 'bg-slate-100'} transition-colors duration-300`}>
      <div className="container mx-auto py-8">
        <div className="flex gap-8 items-start justify-center">
          <Chessboard />
          <Sidebar />
        </div>
      </div>
    </div>
  );
}

export default App;