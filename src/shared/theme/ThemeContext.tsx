import React, { createContext, useContext, useState, useCallback } from 'react';
import { ColorScheme, ColorPalette, colors } from '../tokens';

interface ThemeContextValue {
  colorScheme: ColorScheme;
  colors: ColorPalette;
  toggleColorScheme: () => void;
  setColorScheme: (scheme: ColorScheme) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export interface ThemeProviderProps {
  children: React.ReactNode;
  initialColorScheme?: ColorScheme;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  initialColorScheme = 'light',
}) => {
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>(initialColorScheme);

  const toggleColorScheme = useCallback(() => {
    setColorSchemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const setColorScheme = useCallback((scheme: ColorScheme) => {
    setColorSchemeState(scheme);
  }, []);

  const value: ThemeContextValue = {
    colorScheme,
    colors: colors[colorScheme],
    toggleColorScheme,
    setColorScheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
