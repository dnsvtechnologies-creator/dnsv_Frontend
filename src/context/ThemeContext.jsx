import React, { createContext, useContext, useEffect } from 'react';

const ThemeContext = createContext({
  theme: 'light',
  isDark: false,
  isOffWhite: true,
  isLight: true
});

export function ThemeProvider({ children }) {
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    root.classList.add('theme-light', 'theme-offwhite');
    body.classList.add('theme-light', 'theme-offwhite');
    root.classList.remove('theme-dark');
    body.classList.remove('theme-dark');
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        theme: 'light',
        isDark: false,
        isLight: true,
        isOffWhite: true
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}


