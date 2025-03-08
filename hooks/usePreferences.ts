import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserPreferences } from '../types';
import { ThemeMode } from '../context/ThemeContext';

const PREFERENCES_STORAGE_KEY = 'userPreferences';

const defaultPreferences: UserPreferences = {
  selectedServiceIds: [],
  yearRange: {
    startYear: 1900,
    endYear: new Date().getFullYear()
  },
  themeMode: 'system'
};

export const usePreferences = () => {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load preferences from AsyncStorage
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const storedPreferences = await AsyncStorage.getItem(PREFERENCES_STORAGE_KEY);
        
        if (storedPreferences) {
          setPreferences(JSON.parse(storedPreferences));
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Failed to load preferences:', error);
        setError(error instanceof Error ? error : new Error('Unknown error loading preferences'));
        setLoading(false);
      }
    };

    loadPreferences();
  }, []);

  // Save preferences to AsyncStorage
  const savePreferences = async (newPreferences: UserPreferences) => {
    try {
      await AsyncStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(newPreferences));
      setPreferences(newPreferences);
      return true;
    } catch (error) {
      console.error('Failed to save preferences:', error);
      setError(error instanceof Error ? error : new Error('Unknown error saving preferences'));
      return false;
    }
  };

  // Update selected streaming services
  const updateSelectedServices = async (serviceIds: number[]) => {
    // Validate input to ensure we have valid provider IDs
    const validServiceIds = serviceIds.filter(id => typeof id === 'number' && id > 0);
    
    const newPreferences: UserPreferences = {
      ...preferences,
      selectedServiceIds: validServiceIds,
    };
    
    return savePreferences(newPreferences);
  };

  // Update year range
  const updateYearRange = async (startYear: number, endYear: number) => {
    // Validate input to ensure we have valid years
    const currentYear = new Date().getFullYear();
    const validStartYear = Math.max(1900, Math.min(startYear, currentYear));
    const validEndYear = Math.max(validStartYear, Math.min(endYear, currentYear));
    
    const newPreferences: UserPreferences = {
      ...preferences,
      yearRange: {
        startYear: validStartYear,
        endYear: validEndYear
      }
    };
    
    return savePreferences(newPreferences);
  };

  // Update theme mode
  const updateThemeMode = async (themeMode: ThemeMode) => {
    const newPreferences: UserPreferences = {
      ...preferences,
      themeMode,
    };
    
    return savePreferences(newPreferences);
  };

  return {
    preferences,
    loading,
    error,
    updateSelectedServices,
    updateYearRange,
    updateThemeMode
  };
};
