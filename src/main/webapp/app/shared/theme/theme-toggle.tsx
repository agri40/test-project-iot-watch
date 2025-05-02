/**
 * Theme Toggle Component
 * 
 * This component provides UI controls for changing the application theme.
 * It includes both a dropdown select and a toggle button for switching
 * between light and dark modes.
 */
import React from 'react';
import { useTheme } from './theme-provider';

/**
 * ThemeToggle component that allows users to switch between themes
 */
export function ThemeToggle() {
  // Get the current theme and setter function from context
  const { theme, setTheme } = useTheme();

  return (
    <div className="theme-toggle">
      {/* Dropdown for selecting theme (light, dark, or system) */}
      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'system')}
        className="theme-select"
        aria-label="Select theme"
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="system">System</option>
      </select>
      
      {/* Quick toggle button between light and dark */}
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