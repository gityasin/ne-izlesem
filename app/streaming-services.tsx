import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, Image, ScrollView } from 'react-native';
import { Text, Checkbox, Button, Divider, ActivityIndicator } from 'react-native-paper';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { tmdbService } from '../services/tmdbService';
import { StreamingService } from '../types';
import { ENV } from '../constants/.env';
import { usePreferences } from '../hooks/usePreferences';
import { useTheme } from '../context/ThemeContext';
import i18n from '../localization/i18n';

// List of popular streaming services in Turkey in the requested order
const POPULAR_TR_STREAMING_SERVICES = [
  8,    // Netflix
  119,  // Amazon Prime Video
  337,  // Disney+
  384,  // HBO Max
  350,  // Apple TV+
  188,  // YouTube Premium
  341,  // BluTV
  342,  // Puhu TV
  1899, // Gain
  1796, // Exxen
  2385, // TOD
  2202, // TV+
  1870, // MUBI
];

export default function StreamingServicesScreen() {
  const { preferences, updateSelectedServices } = usePreferences();
  const { theme } = useTheme();
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  // Fetch streaming services from TMDB API
  const { data: streamingServices, isLoading: isLoadingServices, error } = useQuery({
    queryKey: ['watchProviders'],
    queryFn: tmdbService.getWatchProviders,
  });

  useEffect(() => {
    // Load saved preferences
    const loadPreferences = async () => {
      try {
        // Set selected services from preferences
        if (preferences.selectedServiceIds) {
          setSelectedServices(preferences.selectedServiceIds);
        }
      } catch (error) {
        console.error('Error loading preferences:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPreferences();
  }, [preferences]);

  const toggleService = (serviceId: number) => {
    setSelectedServices(prevSelected => {
      if (prevSelected.includes(serviceId)) {
        return prevSelected.filter(id => id !== serviceId);
      } else {
        return [...prevSelected, serviceId];
      }
    });
  };

  const savePreferences = async () => {
    try {
      // Save selected services
      await updateSelectedServices(selectedServices);
      
      // Invalidate recommendations queries to ensure fresh data on next fetch
      queryClient.invalidateQueries({ queryKey: ['movies', 'recommendations'] });
      queryClient.invalidateQueries({ queryKey: ['tv', 'recommendations'] });
      
      console.log('Preferences saved, recommendations cache invalidated');
      
      router.back(); // Navigate back after saving
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  // Filter and sort streaming services to prioritize popular Turkish services
  const getFilteredStreamingServices = () => {
    if (!streamingServices || !Array.isArray(streamingServices)) return [];

    // Filter services to only include those available in Turkey
    const trServices = streamingServices.filter(service => 
      service && service.display_priorities && 'TR' in service.display_priorities
    );

    // Sort services by priority
    return trServices.sort((a, b) => {
      if (!a || !b) return 0;
      
      // First prioritize our list of popular Turkish services
      const aPopularIndex = POPULAR_TR_STREAMING_SERVICES.indexOf(a.provider_id);
      const bPopularIndex = POPULAR_TR_STREAMING_SERVICES.indexOf(b.provider_id);
      
      if (aPopularIndex !== -1 && bPopularIndex !== -1) {
        return aPopularIndex - bPopularIndex;
      } else if (aPopularIndex !== -1) {
        return -1;
      } else if (bPopularIndex !== -1) {
        return 1;
      }
      
      // Then sort by TMDB display priority for Turkey
      const aPriority = a.display_priorities?.TR || 999;
      const bPriority = b.display_priorities?.TR || 999;
      return aPriority - bPriority;
    });
  };

  if (loading || isLoadingServices) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>
          {i18n.t('streamingServices.loading')}
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.errorText, { color: theme.colors.text }]}>
          {i18n.t('streamingServices.error')}
        </Text>
        <Button mode="contained" onPress={() => router.back()}>
          {i18n.t('common.back')}
        </Button>
      </View>
    );
  }

  const filteredServices = getFilteredStreamingServices();

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Stack.Screen options={{ title: i18n.t('streamingServices.title') }} />
      
      <Text style={[styles.header, { color: theme.colors.text }]}>
        {i18n.t('streamingServices.description')}
      </Text>
      
      <Divider style={styles.divider} />
      
      {filteredServices.length > 0 ? (
        <FlatList
          data={filteredServices}
          keyExtractor={(item) => `service-${item.provider_id || Math.random()}`}
          renderItem={({ item }) => (
            <View style={styles.serviceItem}>
              <View style={styles.serviceInfo}>
                <Image 
                  source={{ 
                    uri: `${ENV.TMDB_IMAGE_BASE_URL}${item.logo_path}` 
                  }} 
                  style={styles.serviceLogo} 
                  resizeMode="contain"
                />
                <Text style={[styles.serviceName, { color: theme.colors.text }]}>
                  {item.provider_name || 'Unknown Service'}
                </Text>
              </View>
              <Checkbox
                status={selectedServices.includes(item.provider_id) ? 'checked' : 'unchecked'}
                onPress={() => toggleService(item.provider_id)}
                color={theme.colors.primary}
              />
            </View>
          )}
          ItemSeparatorComponent={() => <Divider />}
          scrollEnabled={false}
          nestedScrollEnabled={true}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={{ color: theme.colors.text }}>
            {i18n.t('streamingServices.empty')}
          </Text>
        </View>
      )}
      
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
    backgroundColor: '#fff',
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    textAlign: 'center',
    marginBottom: 16,
  },
  header: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  divider: {
    marginVertical: 16,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  serviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  serviceLogo: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  serviceName: {
    fontSize: 16,
  },
  emptyContainer: {
    padding: 16,
    alignItems: 'center',
  },
  buttonContainer: {
    marginTop: 24,
    marginBottom: 40,
  },
});
