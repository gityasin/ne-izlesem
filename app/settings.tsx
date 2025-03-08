import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, Switch, Button, Divider, ActivityIndicator } from 'react-native-paper';
import { Stack, router } from 'expo-router';
import Slider from '@react-native-community/slider';
import { usePreferences } from '../hooks/usePreferences';
import { useTheme } from '../context/ThemeContext';
import i18n from '../localization/i18n';

// Min and max years for the year range slider
const MIN_YEAR = 1900;
const MAX_YEAR = new Date().getFullYear();

export default function SettingsScreen() {
  const { preferences, updateYearRange, updateThemeMode } = usePreferences();
  const { isDarkMode, toggleTheme, themeMode, setThemeMode, theme } = useTheme();
  const [startYear, setStartYear] = useState(MIN_YEAR);
  const [endYear, setEndYear] = useState(MAX_YEAR);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load saved preferences
    const loadPreferences = async () => {
      try {
        // Set year range from preferences
        if (preferences.yearRange) {
          setStartYear(preferences.yearRange.startYear);
          setEndYear(preferences.yearRange.endYear);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading preferences:', error);
        setLoading(false);
      }
    };

    loadPreferences();
  }, [preferences]);

  const handleStartYearChange = (value: number) => {
    // Ensure start year is not greater than end year
    const newStartYear = Math.min(value, endYear);
    setStartYear(newStartYear);
  };

  const handleEndYearChange = (value: number) => {
    // Ensure end year is not less than start year
    const newEndYear = Math.max(value, startYear);
    setEndYear(newEndYear);
  };

  const handleThemeModeChange = (mode: 'light' | 'dark' | 'system') => {
    setThemeMode(mode);
    updateThemeMode(mode);
  };

  const savePreferences = async () => {
    try {
      // Save year range
      await updateYearRange(startYear, endYear);
      
      router.back(); // Navigate back after saving
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>
          {i18n.t('settings.loading')}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Stack.Screen options={{ title: i18n.t('settings.title') }} />
      
      <View style={styles.settingSection}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          {i18n.t('settings.appearance')}
        </Text>
        
        <View style={styles.settingItem}>
          <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
            {i18n.t('settings.darkMode')}
          </Text>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            color={theme.colors.primary}
          />
        </View>
        
        <View style={styles.themeOptions}>
          <Button 
            mode={themeMode === 'light' ? 'contained' : 'outlined'}
            onPress={() => handleThemeModeChange('light')}
            style={styles.themeButton}
          >
            {i18n.t('settings.light')}
          </Button>
          
          <Button 
            mode={themeMode === 'dark' ? 'contained' : 'outlined'}
            onPress={() => handleThemeModeChange('dark')}
            style={styles.themeButton}
          >
            {i18n.t('settings.dark')}
          </Button>
          
          <Button 
            mode={themeMode === 'system' ? 'contained' : 'outlined'}
            onPress={() => handleThemeModeChange('system')}
            style={styles.themeButton}
          >
            {i18n.t('settings.system')}
          </Button>
        </View>
      </View>
      
      <Divider style={styles.divider} />
      
      <View style={styles.settingSection}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          {i18n.t('settings.contentFilters')}
        </Text>
        
        <Text style={[styles.settingDescription, { color: theme.colors.text }]}>
          {i18n.t('settings.yearRangeDescription')}
        </Text>
        
        <View style={styles.yearRangeContainer}>
          <Text style={[styles.yearLabel, { color: theme.colors.text }]}>
            {i18n.t('settings.startYear')}: {startYear}
          </Text>
          <Slider
            value={startYear}
            minimumValue={MIN_YEAR}
            maximumValue={MAX_YEAR}
            step={1}
            onValueChange={(value) => handleStartYearChange(Math.floor(value))}
            style={styles.slider}
            minimumTrackTintColor={theme.colors.primary}
            maximumTrackTintColor={theme.dark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.26)'}
            thumbTintColor={theme.colors.primary}
          />
          
          <Text style={[styles.yearLabel, { color: theme.colors.text }]}>
            {i18n.t('settings.endYear')}: {endYear}
          </Text>
          <Slider
            value={endYear}
            minimumValue={MIN_YEAR}
            maximumValue={MAX_YEAR}
            step={1}
            onValueChange={(value) => handleEndYearChange(Math.floor(value))}
            style={styles.slider}
            minimumTrackTintColor={theme.colors.primary}
            maximumTrackTintColor={theme.dark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.26)'}
            thumbTintColor={theme.colors.primary}
          />
        </View>
      </View>
      
      <View style={styles.buttonContainer}>
        <Button 
          mode="contained" 
          onPress={savePreferences}
        >
          {i18n.t('common.save')}
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
  },
  settingSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  settingDescription: {
    marginBottom: 16,
    fontSize: 14,
  },
  divider: {
    marginVertical: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingLabel: {
    fontSize: 16,
  },
  themeOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  themeButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  yearRangeContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  yearLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  slider: {
    marginBottom: 24,
  },
  buttonContainer: {
    marginTop: 24,
    marginBottom: 40,
  },
}); 