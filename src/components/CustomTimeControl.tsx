import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';

const CustomTimeControl: React.FC = () => {
  const { setTimeControl } = useGameStore();
  const [minutes, setMinutes] = useState(10);
  
  const handleApplyCustomTime = () => {
    setTimeControl('custom' as any);
  };
  
  return (
    <div className="mt-6 p-4 bg-gray-100 rounded-xl">
      <h4 className="font-bold text-lg mb-3">Custom Time</h4>
      
      <div className="flex items-center justify-center gap-4">
        <div className="flex items-center">
          <button 
            onClick={() => setMinutes(prev => Math.max(1, prev - 1))}
            className="px-3 py-1 bg-gray-300 hover:bg-gray-400 rounded-l-lg"
          >
            -
          </button>
          
          <input 
            type="number" 
            min="1"
            max="60"
            value={minutes}
            onChange={(e) => setMinutes(parseInt(e.target.value) || 1)}
            className="w-16 text-center py-1 border-0 focus:ring-0"
          />
          
          <button 
            onClick={() => setMinutes(prev => Math.min(60, prev + 1))}
            className="px-3 py-1 bg-gray-300 hover:bg-gray-400 rounded-r-lg"
          >
            +
          </button>
        </div>
        
        <span className="text-gray-600">minutes per player</span>
        
        <button
          onClick={handleApplyCustomTime}
          className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default CustomTimeControl;