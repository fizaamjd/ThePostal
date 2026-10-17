import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { buildTheme } from '../theme';

const ModeContext = createContext({ mode: 'light', toggle: () => {} });

const KEY = 'postal.mode';

/**
 * Light and dark are both first-class here, so the choice is remembered and the
 * first paint respects the operating system rather than flashing the wrong one.
 */
export function ThemeModeProvider({ children }) {
  const [mode, setMode] = useState('light');

  useEffect(() => {
    let next = null;
    try {
      next = window.localStorage.getItem(KEY);
    } catch {
      // Private browsing and blocked site data both land here; the OS
      // preference below is a perfectly good answer on its own.
    }
    if (next !== 'light' && next !== 'dark') {
      next = window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    setMode(next);
  }, []);

  const toggle = useCallback(() => {
    setMode((current) => {
      const next = current === 'dark' ? 'light' : 'dark';
      try {
        window.localStorage.setItem(KEY, next);
      } catch {
        // Not being able to remember the choice must not break making it.
      }
      return next;
    });
  }, []);

  const theme = useMemo(() => buildTheme(mode), [mode]);
  const value = useMemo(() => ({ mode, toggle }), [mode, toggle]);

  return (
    <ModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ModeContext.Provider>
  );
}

export function useThemeMode() {
  return useContext(ModeContext);
}
