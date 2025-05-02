import React, { createContext, useContext, useEffect, useState } from 'react';

// Define the possible theme types
type Theme = 'dark' | 'light' | 'system';

// Props type for the ThemeProvider component
type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

// State type for the ThemeProvider context
type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

// Initial state for the context
const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
};

// Create the context with initial state
const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

/**
 * ThemeProvider component that manages theme state and applies it to the document
 * @param children - Child components that will have access to the theme
 * @param defaultTheme - Default theme if none is saved (default: 'system')
 * @param storageKey - Key for localStorage to persist the theme (default: 'theme')
 */
export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'theme',
  ...props
}: ThemeProviderProps) {
  // State to manage the current theme
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  // Load saved theme from localStorage when component mounts
  useEffect(() => {
    const savedTheme = localStorage.getItem(storageKey);

    // Only update theme if saved theme is valid
    if (savedTheme && ['dark', 'light', 'system'].includes(savedTheme)) {
      setTheme(savedTheme as Theme);
    }
  }, [storageKey]);

  // Apply the current theme to the document when theme changes
  useEffect(() => {
    const root = window.document.documentElement;

    // Remove all theme classes first
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      // Use system preference if theme is set to 'system'
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches 
        ? 'dark' 
        : 'light';
      root.classList.add(systemTheme);
      return;
    }

    // Add the selected theme class
    root.classList.add(theme);
  }, [theme]);

  // Context value containing current theme and setter function
  const value = {
    theme,
    setTheme: (theme: Theme) => {
      // Persist theme preference to localStorage
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
 * Custom hook to access theme context
 * @throws Error if used outside of ThemeProvider
 * @returns Current theme and setTheme function
 */
export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};