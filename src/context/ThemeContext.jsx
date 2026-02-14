import { createContext, useContext, useState, useEffect } from 'react';

const STORAGE_KEY = 'uniconnect_week_theme';
const THEMES = ['default', 'nature', 'neon', 'retro'];

const ThemeContext = createContext(null);

function getStoredTheme() {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return THEMES.includes(v) ? v : 'default';
  } catch (_) {
    return 'default';
  }
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(getStoredTheme);

  useEffect(() => {
    setThemeState(getStoredTheme);
  }, []);

  const setTheme = (value) => {
    if (!THEMES.includes(value)) value = 'default';
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch (_) {}
    setThemeState(value);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) return { theme: 'default', setTheme: () => {} };
  return ctx;
}
