// src/components/HelpButton.tsx
'use client';

import { useState, useEffect } from 'react';
import { FiHelpCircle } from 'react-icons/fi';
import { useTutorial } from '../hooks/useTutorial';

const HelpButton = () => {
  const { startTutorial } = useTutorial();
  const [showPulse, setShowPulse] = useState(true);

  // Stop pulse animation after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowPulse(false), 10000);
    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    setShowPulse(false);
    startTutorial();
  };

  return (
    <button
      id="help-button"
      onClick={handleClick}
      className="fixed bottom-4 left-4 z-[1000] h-10 w-10 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-200 border border-zinc-200 dark:border-gray-700 hover:scale-110"
      aria-label="Help & Tutorial"
      title="Help & Tutorial"
    >
      {showPulse && (
        <span className="absolute inset-0 rounded-full bg-blue-500/30 animate-ping" />
      )}
      <FiHelpCircle className="h-5 w-5 text-zinc-500 dark:text-gray-300 relative z-10" />
    </button>
  );
};

export default HelpButton;
