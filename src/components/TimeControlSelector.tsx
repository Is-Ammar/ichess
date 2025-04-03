import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { TimeControl } from '../types/chess';

const TIME_CONTROL_OPTIONS = {
  bullet: { 
    name: 'Bullet', 
    icon: '⚡', 
    description: '1 min', 
    tagline: 'Lightning fast'
  },
  blitz: { 
    name: 'Blitz', 
    icon: '🔥', 
    description: '5 min', 
    tagline: 'Think quickly'
  },
  rapid: { 
    name: 'Rapid', 
    icon: '🚀', 
    description: '10 min', 
    tagline: 'Balanced pace'
  },
  classical: { 
    name: 'Classical', 
    icon: '🧠', 
    description: '30 min', 
    tagline: 'Take your time'
  },
  custom: { 
    name: 'Custom', 
    icon: '⚙️', 
    description: 'Your choice', 
    tagline: 'Set your own pace'
  }
};

export const TimeControlSelector: React.FC = () => {
  const { timeControl, setTimeControl, setCustomTimeControl } = useGameStore();
  const [showCustom, setShowCustom] = useState(false);
  const [customMinutes, setCustomMinutes] = useState(10);

  const handleTimeSelect = (tc: TimeControl) => {
    if (tc === 'custom') {
      setShowCustom(true);
    } else {
      setTimeControl(tc);
      setShowCustom(false);
    }
  };

  const handleCustomApply = () => {
    setCustomTimeControl(customMinutes);
    setShowCustom(false);
  };

  return (
    <div className="w-full max-w-2xl bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
      <h3 className="text-xl font-bold mb-4 text-center">Choose Time Control</h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {(Object.keys(TIME_CONTROL_OPTIONS) as TimeControl[]).map((tc) => (
          <button
            key={tc}
            onClick={() => handleTimeSelect(tc)}
            className={`
              flex flex-col items-center p-3 rounded-lg transition-all
              ${timeControl === tc 
                ? 'bg-blue-500 text-white ring-2 ring-blue-300' 
                : 'bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600'}
            `}
          >
            <span className="text-2xl mb-1">{TIME_CONTROL_OPTIONS[tc].icon}</span>
            <span className="font-medium">{TIME_CONTROL_OPTIONS[tc].name}</span>
            <span className="text-sm opacity-80">{TIME_CONTROL_OPTIONS[tc].description}</span>
          </button>
        ))}
      </div>
      
      {showCustom && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <span>Minutes per player:</span>
            <div className="flex items-center">
              <button 
                onClick={() => setCustomMinutes(Math.max(1, customMinutes - 1))}
                className="px-3 py-1 bg-gray-200 dark:bg-slate-600 hover:bg-gray-300 rounded-l-lg"
              >
                -
              </button>
              <input 
                type="number" 
                min="1"
                max="60"
                value={customMinutes}
                onChange={(e) => setCustomMinutes(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 text-center py-1 border-0 bg-white dark:bg-slate-800"
              />
              <button 
                onClick={() => setCustomMinutes(Math.min(60, customMinutes + 1))}
                className="px-3 py-1 bg-gray-200 dark:bg-slate-600 hover:bg-gray-300 rounded-r-lg"
              >
                +
              </button>
            </div>
            
            <button
              onClick={handleCustomApply}
              className="px-4 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Apply
            </button>
          </div>
        </div>
      )}
      
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
        {!showCustom && TIME_CONTROL_OPTIONS[timeControl].tagline}
      </p>
    </div>
  );
};