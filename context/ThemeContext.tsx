import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';

// Storage key for theme preference
const THEME_STORAGE_KEY = 'themeMode';

// Theme modes
export type ThemeMode = 'light' | 'dark' | 'system';

// Custom theme interface extending Paper's theme
export interface CustomTheme extends MD3Theme {
  // Additional custom properties
  colors: MD3Theme['colors'] & {
    card: string;
    text: string;
    border: string;
    notification: string;
    accent: string;
    backdrop: string;
  };
}

// Create light and dark themes
export const lightTheme: CustomTheme = {
  ...MD3LightTheme,
  dark: false,
  colors: {
    ...MD3LightTheme.colors,
    card: '#ffffff',
    text: '#000000',
    border: '#e0e0e0',
    notification: '#f50057',
    accent: '#03dac4',
    backdrop: 'rgba(0, 0, 0, 0.5)',
  },
};

export const darkTheme: CustomTheme = {
  ...MD3DarkTheme,
  dark: true,
  colors: {
    ...MD3DarkTheme.colors,
    card: '#1e1e1e',
    text: '#ffffff',
    border: '#2c2c2c',
    notification: '#cf6679',
    accent: '#03dac6',
    backdrop: 'rgba(0, 0, 0, 0.5)',
  },
};

// Theme context interface
interface ThemeContextType {
  theme: CustomTheme;
  themeMode: ThemeMode;
  isDarkMode: boolean;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

// Create the context with a default value
export const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  themeMode: 'system',
  isDarkMode: false,
  setThemeMode: () => {},
  toggleTheme: () => {},
});

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);

// Theme provider component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const colorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  
  // Determine if dark mode is active based on theme mode and system preference
  const isDarkMode = 
    themeMode === 'dark' || (themeMode === 'system' && colorScheme === 'dark');
  
  // Set the active theme based on dark mode state
  const theme = isDarkMode ? darkTheme : lightTheme;
  
  // Load saved theme preference on mount
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedThemeMode = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedThemeMode) {
          setThemeMode(savedThemeMode as ThemeMode);
        }
      } catch (error) {
        console.error('Failed to load theme preference:', error);
      }
    };
    
    loadThemePreference();
  }, []);
  
  // Save theme preference when it changes
  useEffect(() => {
    const saveThemePreference = async () => {
      try {
        await AsyncStorage.setItem(THEME_STORAGE_KEY, themeMode);
      } catch (error) {
        console.error('Failed to save theme preference:', error);
      }
    };
    
    saveThemePreference();
  }, [themeMode]);
  
  // Toggle between light and dark mode
  const toggleTheme = () => {
    setThemeMode(prevMode => {
      if (prevMode === 'light') return 'dark';
      if (prevMode === 'dark') return 'light';
      // If system, set to the opposite of the system preference
      return colorScheme === 'dark' ? 'light' : 'dark';
    });
  };
  
  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeMode,
        isDarkMode,
        setThemeMode,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}; 