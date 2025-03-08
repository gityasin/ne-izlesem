import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { Text, Chip, Divider } from 'react-native-paper';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { tmdbService } from '../../services/tmdbService';
import { ENV } from '../../constants/.env';
import { StreamingServiceIcon } from '../../components/StreamingServiceIcon';

const { width } = Dimensions.get('window');
const POSTER_WIDTH = width * 0.4;
const POSTER_HEIGHT = POSTER_WIDTH * 1.5;

export default function DetailsScreen() {
  const { id, mediaType } = useLocalSearchParams<{ id: string; mediaType: 'movie' | 'tv' }>();
  
  // Fetch media details
  const { data, isLoading, error } = useQuery({
    queryKey: ['mediaDetails', mediaType, id],
    queryFn: () => {
      const mediaId = parseInt(id || '0');
      if (mediaType === 'tv') {
        return tmdbService.getTVShowDetails(mediaId);
      }
      return tmdbService.getMovieDetails(mediaId);
    },
    enabled: !!id && !!mediaType,
  });

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Detaylar yükleniyor...</Text>
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Detaylar yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.
        </Text>
      </View>
    );
  }

  const title = data.title || data.name || '';
  const originalTitle = (data.original_title && data.original_title !== title) 
    ? data.original_title 
    : (data.original_name && data.original_name !== title)
    ? data.original_name
    : null;
  
  const releaseDate = data.release_date 
    ? new Date(data.release_date).toLocaleDateString('tr-TR') 
    : data.first_air_date 
    ? new Date(data.first_air_date).toLocaleDateString('tr-TR')
    : 'Bilinmiyor';
  
  const runtime = data.runtime 
    ? `${data.runtime} dakika`
    : data.episode_run_time && data.episode_run_time.length 
    ? `Bölüm başına ortalama ${data.episode_run_time[0]} dakika`
    : 'Bilinmiyor';
  
  const posterUrl = data.poster_path 
    ? `${ENV.TMDB_IMAGE_BASE_URL}${data.poster_path}`
    : 'https://via.placeholder.com/300x450?text=No+Image';
  
  const backdropUrl = data.backdrop_path
    ? `${ENV.TMDB_IMAGE_BASE_URL}${data.backdrop_path}`
    : null;

  // Get streaming providers for Turkey (TR)
  const providers = data.watch_providers?.results?.TR || {};
  const streamingProviders = providers.flatrate || [];

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: title }} />

      {backdropUrl && (
        <View style={styles.backdropContainer}>
          <Image source={{ uri: backdropUrl }} style={styles.backdrop} />
          <View style={styles.backdropGradient} />
        </View>
      )}

      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Image source={{ uri: posterUrl }} style={styles.poster} />
          
          <View style={styles.headerInfo}>
            <Text variant="headlineSmall" style={styles.title}>{title}</Text>
            
            {originalTitle && (
              <Text variant="bodyMedium" style={styles.originalTitle}>
                {originalTitle}
              </Text>
            )}
            
            <View style={styles.statsContainer}>
              <Text variant="bodyMedium">
                <Text style={styles.statLabel}>Yayın Tarihi:</Text> {releaseDate}
              </Text>
              
              <Text variant="bodyMedium">
                <Text style={styles.statLabel}>Süre:</Text> {runtime}
              </Text>
              
              <Text variant="bodyMedium">
                <Text style={styles.statLabel}>Puanlama:</Text> ★ {data.vote_average.toFixed(1)} ({data.vote_count} oy)
              </Text>
            </View>
            
            {data.genres && data.genres.length > 0 && (
              <View style={styles.genresContainer}>
                {data.genres.map(genre => (
                  <Chip key={genre.id} style={styles.genreChip}>
                    {genre.name}
                  </Chip>
                ))}
              </View>
            )}
          </View>
        </View>

        {data.tagline && (
          <Text variant="bodyLarge" style={styles.tagline}>
            "{data.tagline}"
          </Text>
        )}

        <Divider style={styles.divider} />

        <Text variant="titleMedium" style={styles.sectionTitle}>
          Özet
        </Text>
        <Text variant="bodyMedium" style={styles.overview}>
          {data.overview || 'Bu içerik için özet bulunmuyor.'}
        </Text>

        {streamingProviders.length > 0 && (
          <>
            <Divider style={styles.divider} />
            <Text variant="titleMedium" style={styles.sectionTitle}>
              İzleyebileceğiniz Platformlar
            </Text>
            <View style={styles.providersContainer}>
              {streamingProviders.map(provider => (
                <View key={provider.provider_id} style={styles.providerItem}>
                  <StreamingServiceIcon id={provider.provider_id} size={50} />
                </View>
              ))}
            </View>
          </>
        )}

        {data.credits && data.credits.cast && data.credits.cast.length > 0 && (
          <>
            <Divider style={styles.divider} />
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Oyuncular
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.castContainer}>
              {data.credits.cast.slice(0, 10).map(person => {
                const profileUrl = person.profile_path
                  ? `${ENV.TMDB_IMAGE_BASE_URL}${person.profile_path}`
                  : 'https://via.placeholder.com/150x225?text=No+Image';
                
                return (
                  <View key={person.id} style={styles.castItem}>
                    <Image source={{ uri: profileUrl }} style={styles.castImage} />
                    <Text variant="bodySmall" numberOfLines={1} style={styles.castName}>
                      {person.name}
                    </Text>
                    <Text variant="bodySmall" numberOfLines={1} style={styles.castCharacter}>
                      {person.character}
                    </Text>
                  </View>
                );
              })}
            </ScrollView>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    textAlign: 'center',
  },
  backdropContainer: {
    width: '100%',
    height: 200,
    position: 'relative',
  },
  backdrop: {
    width: '100%',
    height: '100%',
  },
  backdropGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  contentContainer: {
    padding: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  poster: {
    width: POSTER_WIDTH,
    height: POSTER_HEIGHT,
    borderRadius: 8,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 16,
  },
  title: {
    fontWeight: 'bold',
  },
  originalTitle: {
    fontStyle: 'italic',
    marginBottom: 8,
  },
  statsContainer: {
    marginVertical: 8,
  },
  statLabel: {
    fontWeight: 'bold',
  },
  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  genreChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  tagline: {
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 16,
  },
  divider: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  overview: {
    lineHeight: 22,
  },
  providersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  providerItem: {
    marginRight: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  castContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  castItem: {
    width: 100,
    marginRight: 16,
  },
  castImage: {
    width: 100,
    height: 150,
    borderRadius: 8,
    marginBottom: 4,
  },
  castName: {
    fontWeight: 'bold',
  },
  castCharacter: {
    fontStyle: 'italic',
  },
});
