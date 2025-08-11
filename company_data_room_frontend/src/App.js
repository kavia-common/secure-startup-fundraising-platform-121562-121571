import React, { useEffect, useState } from 'react';
import './App.css';
import { AppRouter } from './routes/AppRouter';

/**
 * PUBLIC_INTERFACE
 * App is the root component. It manages theme (light/dark) and renders the application router.
 * It sets the data-theme attribute on the document to enable CSS variable-based theming.
 */
export default function App() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  /** PUBLIC_INTERFACE
   * Toggles the theme between light and dark modes.
   */
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <AppRouter theme={theme} onToggleTheme={toggleTheme} />
  );
}
