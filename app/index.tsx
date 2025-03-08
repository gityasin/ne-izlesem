import React from 'react';
import { StyleSheet, View, ScrollView, Image } from 'react-native';
import { Text, Button, IconButton, Card, Surface, useTheme as usePaperTheme } from 'react-native-paper';
import { Link, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../context/ThemeContext';
import i18n from '../localization/i18n';

export default function HomeScreen() {
  const { theme } = useTheme();
  const paperTheme = usePaperTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Stack.Screen 
        options={{ 
          title: i18n.t('appName'),
          headerRight: () => (
            <Link href="/settings" asChild>
              <IconButton
                icon="cog"
                size={24}
                onPress={() => {}}
                iconColor={theme.colors.onSurface}
              />
            </Link>
          ),
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
});
