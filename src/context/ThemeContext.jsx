import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getColors } from '../theme/theme';

const THEME_STORAGE_KEY = '@manahrms_theme_mode';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [themeMode, setThemeModeState] = useState('light');
  const [isThemeReady, setIsThemeReady] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const saved = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (saved === 'light' || saved === 'dark') {
          setThemeModeState(saved);
        }
      } catch {
        // keep default 'light'
      } finally {
        setIsThemeReady(true);
      }
    };
    loadTheme();
  }, []);

  const setThemeMode = async (mode) => {
    if (mode !== 'light' && mode !== 'dark') return;
    setThemeModeState(mode);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch {
      // ignore
    }
  };

  const toggleTheme = async () => {
    const next = themeMode === 'light' ? 'dark' : 'light';
    await setThemeMode(next);
  };

  const colors = useMemo(() => getColors(themeMode), [themeMode]);
  const isDark = themeMode === 'dark';

  const value = useMemo(
    () => ({
      themeMode,
      setThemeMode,
      toggleTheme,
      colors,
      isDark,
      isThemeReady,
    }),
    [themeMode, colors, isDark, isThemeReady]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
