import React from 'react';
import { View, StyleSheet, Image, Pressable, useWindowDimensions } from 'react-native';
import { Text, Card, Chip } from 'react-native-paper';
import { Link } from 'expo-router';
import { MediaItem } from '../types';
import { ENV } from '../constants/.env';
import { StreamingServiceIcon } from './StreamingServiceIcon';
import { useGenres } from '../hooks/useGenres';
import { useWatchProviders } from '../hooks/useWatchProviders';
import { useTheme } from '../context/ThemeContext';

// Define the provider type
interface Provider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
}

interface MediaCardProps {
  item: MediaItem;
  onPress?: () => void;
}

export const MediaCard: React.FC<MediaCardProps> = ({ item, onPress }) => {
  // Use window dimensions for responsive sizing
  const { width } = useWindowDimensions();
  // Use theme for styling based on dark/light mode
  const { theme } = useTheme();
  
  // Calculate responsive sizes
  const cardWidth = width > 600 ? 500 : width - 32;
  const posterWidth = width > 600 ? 120 : width > 400 ? 100 : 80;
  const posterHeight = posterWidth * 1.5;
  
  // Use the useGenres hook to get the real genres from the API
  const { genres: allGenres } = useGenres();
  
  // Use the useWatchProviders hook to get the watch providers for this item
  const { flatrateProviders, isLoading: isLoadingProviders } = useWatchProviders(
    item.id,
    item.media_type || 'movie'
  );
  
  const imageUrl = item.poster_path 
    ? `${ENV.TMDB_IMAGE_BASE_URL}${item.poster_path}`
    : 'https://via.placeholder.com/300x450?text=No+Image';

  const title = item.title || item.name || 'İsimsiz';
  const originalTitle = item.original_title || item.original_name;
  
  const releaseYear = item.release_date
    ? new Date(item.release_date).getFullYear()
    : item.first_air_date
    ? new Date(item.first_air_date).getFullYear()
    : null;

  // Get the first 2 genres using the real genres from the API
  const genres = item.genre_ids
    .slice(0, 2)
    .map(id => {
      const genre = allGenres.find(g => g.id === id);
      return genre ? genre.name : '';
    })
    .filter(Boolean);

  // Create a lighter version of the primary color for chips
  const chipBackgroundColor = theme.dark 
    ? 'rgba(80, 80, 80, 0.3)' 
    : 'rgba(220, 220, 250, 0.5)';

  return (
    <Link 
      href={{
        pathname: '/details/[id]',
        params: { 
          id: item.id.toString(), 
          mediaType: item.media_type || (item.title ? 'movie' : 'tv') 
        },
      }}
      asChild
    >
      <Pressable>
        <Card 
          style={[
            styles.card, 
            { 
              backgroundColor: theme.colors.card,
              width: cardWidth,
              alignSelf: 'center',
            }
          ]}
        >
          <View style={styles.cardContent}>
            <Image 
              source={{ uri: imageUrl }} 
              style={[
                styles.poster,
                {
                  width: posterWidth,
                  height: posterHeight
                }
              ]} 
            />
            
            <View style={styles.infoContainer}>
              <Text 
                variant="titleMedium" 
                numberOfLines={2} 
                style={[styles.title, { color: theme.colors.text }]}
              >
                {title}
              </Text>
              
              {originalTitle && originalTitle !== title && (
                <Text 
                  variant="bodySmall" 
                  numberOfLines={1} 
                  style={[styles.originalTitle, { color: theme.colors.text }]}
                >
                  {originalTitle}
                </Text>
              )}
              
              {releaseYear && (
                <Text 
                  variant="bodySmall" 
                  style={[styles.year, { color: theme.colors.text }]}
                >
                  {releaseYear}
                </Text>
              )}
              
              <View style={styles.ratingContainer}>
                <Text 
                  variant="bodyMedium" 
                  style={[styles.rating, { color: theme.colors.text }]}
                >
                  ★ {item.vote_average.toFixed(1)}
                </Text>
              </View>
              
              {genres.length > 0 && (
                <View style={styles.genreContainer}>
                  {genres.map((genre, index) => (
                    <Chip 
                      key={index} 
                      style={[styles.genreChip, { backgroundColor: chipBackgroundColor }]} 
                      textStyle={[styles.genreText, { color: theme.colors.primary }]}
                    >
                      {genre}
                    </Chip>
                  ))}
                </View>
              )}
              
              <View style={styles.overview}>
                <Text 
                  numberOfLines={3} 
                  variant="bodySmall"
                  style={{ color: theme.colors.text }}
                >
                  {item.overview || 'Açıklama yok.'}
                </Text>
              </View>
              
              {flatrateProviders.length > 0 && (
                <View style={styles.providersContainer}>
                  {flatrateProviders.slice(0, 3).map((provider: Provider) => (
                    <StreamingServiceIcon 
                      key={provider.provider_id} 
                      id={provider.provider_id} 
                      size={24} 
                      logoPath={provider.logo_path}
                    />
                  ))}
                  {flatrateProviders.length > 3 && (
                    <Text 
                      variant="bodySmall" 
                      style={[styles.moreProviders, { color: theme.colors.text }]}
                    >
                      +{flatrateProviders.length - 3}
                    </Text>
                  )}
                </View>
              )}
            </View>
          </View>
        </Card>
      </Pressable>
    </Link>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: {
    flexDirection: 'row',
    padding: 12,
  },
  poster: {
    borderRadius: 8,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontWeight: 'bold',
  },
  originalTitle: {
    fontStyle: 'italic',
    marginBottom: 4,
  },
  year: {
    marginBottom: 4,
  },
  ratingContainer: {
    marginBottom: 8,
  },
  rating: {
    fontWeight: 'bold',
  },
  genreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  genreChip: {
    marginRight: 4,
    marginBottom: 4,
    paddingHorizontal: 4,
    minHeight: 26,
  },
  genreText: {
    fontSize: 11,
    paddingHorizontal: 2,
  },
  overview: {
    marginTop: 8,
  },
  providersContainer: {
    flexDirection: 'row',
    marginTop: 8,
    alignItems: 'center',
  },
  moreProviders: {
    marginLeft: 4,
    fontSize: 12,
    opacity: 0.7,
  },
});
