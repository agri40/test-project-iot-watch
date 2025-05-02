import React from 'react';
import { useTheme } from './theme-provider';

/**
 * ThemeToggle component that provides UI for switching between themes
 * - Includes a dropdown select for all theme options (light/dark/system)
 * - Includes a button for quick toggling between light/dark modes
 */
export function ThemeToggle() {
  // Get current theme and setter function from theme context
  const { theme, setTheme } = useTheme();

  return (
    <div className="theme-toggle">
      {/* Dropdown select for choosing between all theme options */}
      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'system')}
        className="theme-select"
        aria-label="Select theme preference"
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="system">System</option>
      </select>

      {/* Button for quick toggling between light/dark modes */}
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="theme-button"
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>
    </div>
  );
}