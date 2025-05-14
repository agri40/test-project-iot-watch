import React, { useEffect } from 'react';
import './App.css';
import { useDarkMode } from './hooks/useContextDarkMode';

/* Components */
import Content from './components/Content';

function App() {
  // Dark mode state
  const { darkMode } = useDarkMode();

  useEffect(() => {
    // Toggle dark mode class on the document element
    if (darkMode) {
      document.body.setAttribute('data-theme', 'dark');
    }
    else {
      document.body.setAttribute('data-theme', 'light');
    }

  }, [darkMode]);

  return (
    <div className="app w-screen max-w-screen min-h-screen bg-zinc-50">
      <Content />
    </div>
  )
}

export default App;
