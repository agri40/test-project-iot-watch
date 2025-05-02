/**
 * Theme Provider Component
 * 
 * This component provides theme context to the entire application.
 * It manages the theme state (light, dark, or system) and applies
 * the appropriate class to the HTML document element.
 * 
 * The theme is persisted in localStorage to remember user preferences
 * across sessions.
 */
import React, { createContext, useContext, useEffect, useState } from 'react';

// Define the possible theme values
type Theme = 'dark' | 'light' | 'system';

// Props for the ThemeProvider component
type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

// State managed by the ThemeProvider
type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

// Initial state for the context
const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
};

// Create the context
const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

/**
 * ThemeProvider component that wraps the application and provides theme context
 */
export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'theme',
  ...props
}: ThemeProviderProps) {
  // State to track the current theme
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  // Effect to load the saved theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem(storageKey);

    if (savedTheme && ['dark', 'light', 'system'].includes(savedTheme)) {
      setTheme(savedTheme as Theme);
    }
  }, [storageKey]);

  // Effect to apply the theme class to the HTML element when theme changes
  useEffect(() => {
    const root = window.document.documentElement;

    // Remove existing theme classes
    root.classList.remove('light', 'dark');

    // If system preference is selected, determine the system theme
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
      return;
    }

    // Add the selected theme class
    root.classList.add(theme);
  }, [theme]);

  // Create the context value with the current theme and setter function
  const value = {
    theme,
    setTheme: (theme: Theme) => {
      // Save the theme preference to localStorage
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

/**
 * Custom hook to access the theme context
 * Must be used within a ThemeProvider
 */
export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined) throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};