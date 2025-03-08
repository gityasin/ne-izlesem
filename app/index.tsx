import React from 'react';
import { StyleSheet, View, ScrollView, Image, TouchableOpacity, Platform, Pressable } from 'react-native';
import { Text, Button, Card, Surface, useTheme as usePaperTheme, IconButton } from 'react-native-paper';
import { Link, Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../context/ThemeContext';
import i18n from '../localization/i18n';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function HomeScreen() {
  const { theme } = useTheme();
  const paperTheme = usePaperTheme();

  const navigateToSettings = () => {
    router.push('/settings');
  };

  // Platform-specific settings button implementation
  const SettingsButton = () => {
    if (Platform.OS === 'android') {
      // On Android, use Pressable with ripple effect for better feedback
      return (
        <Pressable
          onPress={navigateToSettings}
          style={styles.settingsButton}
          accessibilityLabel={i18n.t('common.settings')}
          testID="settings-button"
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          android_ripple={{ 
            color: theme.dark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)', 
            radius: 28,
            borderless: true 
          }}
        >
          <MaterialCommunityIcons 
            name="cog" 
            size={30} 
            color={theme.colors.onSurface} 
          />
        </Pressable>
      );
    } else {
      // On iOS and other platforms, use IconButton which works better there
      return (
        <IconButton
          icon="cog"
          size={30}
          iconColor={theme.colors.onSurface}
          style={styles.settingsButton}
          onPress={navigateToSettings}
          accessibilityLabel={i18n.t('common.settings')}
          testID="settings-button"
        />
      );
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Stack.Screen 
        options={{ 
          title: i18n.t('appName'),
          headerRight: () => <SettingsButton />,
        }} 
      />
      <StatusBar style={theme.dark ? 'light' : 'dark'} />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Surface style={[styles.headerSurface, { backgroundColor: theme.colors.surfaceVariant }]}>
          <Text 
            variant="headlineMedium" 
            style={[styles.title, { color: theme.colors.onSurfaceVariant }]}
          >
            {i18n.t('appName')}
          </Text>
          <Text 
            variant="bodyLarge" 
            style={[styles.description, { color: theme.colors.onSurfaceVariant }]}
          >
            {i18n.t('home.description')}
          </Text>
        </Surface>
        
        <View style={styles.cardsContainer}>
          <Card style={styles.card} mode="elevated">
            <Card.Content>
              <Text variant="titleLarge" style={{ color: theme.colors.primary }}>
                {i18n.t('home.streamingServices')}
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurface, marginTop: 8 }}>
                {i18n.t('home.streamingServicesDescription')}
              </Text>
            </Card.Content>
            <Card.Actions>
              <Link href="/streaming-services" asChild>
                <Button mode="contained">
                  {i18n.t('home.selectServices')}
                </Button>
              </Link>
            </Card.Actions>
          </Card>
          
          <Card style={styles.card} mode="elevated">
            <Card.Content>
              <Text variant="titleLarge" style={{ color: theme.colors.primary }}>
                {i18n.t('home.recommendations')}
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurface, marginTop: 8 }}>
                {i18n.t('home.recommendationsDescription')}
              </Text>
            </Card.Content>
            <Card.Actions>
              <Link href="/recommendations" asChild>
                <Button mode="contained">
                  {i18n.t('home.viewRecommendations')}
                </Button>
              </Link>
            </Card.Actions>
          </Card>
          
          <Card style={styles.card} mode="elevated">
            <Card.Content>
              <Text variant="titleLarge" style={{ color: theme.colors.primary }}>
                {i18n.t('home.searchTitle')}
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurface, marginTop: 8 }}>
                {i18n.t('home.searchDescription')}
              </Text>
            </Card.Content>
            <Card.Actions>
              <Link href="/search" asChild>
                <Button mode="contained">
                  {i18n.t('home.search')}
                </Button>
              </Link>
            </Card.Actions>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  headerSurface: {
    padding: 24,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    elevation: 2,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 22,
  },
  cardsContainer: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingsButton: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Platform.OS === 'ios' ? -15 : -10,
  },
});
