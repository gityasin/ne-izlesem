import React from 'react';
import { View, StyleSheet, Image, Pressable } from 'react-native';
import { Text, Card, Chip } from 'react-native-paper';
import { Link } from 'expo-router';
import { MediaItem } from '../types';
import { ENV } from '../constants/.env';
import { StreamingServiceIcon } from './StreamingServiceIcon';
import { useGenres } from '../hooks/useGenres';

interface MediaCardProps {
  item: MediaItem;
  onPress?: () => void;
}

export const MediaCard: React.FC<MediaCardProps> = ({ item, onPress }) => {
  // Use the useGenres hook to get the real genres from the API
  const { genres: allGenres } = useGenres();
  
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

  return (
    <Link 
      href={{
        pathname: '/details/[id]',
        params: { id: item.id, mediaType: item.media_type || 'movie' },
      }}
      asChild
    >
      <Pressable>
        <Card style={styles.card}>
          <View style={styles.cardContent}>
            <Image source={{ uri: imageUrl }} style={styles.poster} />
            
            <View style={styles.infoContainer}>
              <Text variant="titleMedium" numberOfLines={2} style={styles.title}>
                {title}
              </Text>
              
              {originalTitle && originalTitle !== title && (
                <Text variant="bodySmall" numberOfLines={1} style={styles.originalTitle}>
                  {originalTitle}
                </Text>
              )}
              
              {releaseYear && (
                <Text variant="bodySmall" style={styles.year}>
                  {releaseYear}
                </Text>
              )}
              
              <View style={styles.ratingContainer}>
                <Text variant="bodyMedium" style={styles.rating}>
                  ★ {item.vote_average.toFixed(1)}
                </Text>
              </View>
              
              {genres.length > 0 && (
                <View style={styles.genreContainer}>
                  {genres.map((genre, index) => (
                    <Chip key={index} style={styles.genreChip} textStyle={styles.genreText}>
                      {genre}
                    </Chip>
                  ))}
                </View>
              )}
              
              <View style={styles.overview}>
                <Text numberOfLines={3} variant="bodySmall">
                  {item.overview || 'Açıklama yok.'}
                </Text>
              </View>
              
              {/* We'll implement this later when we have the watch provider data */}
              {/* <View style={styles.providersContainer}>
                {item.watch_providers?.results?.TR?.flatrate?.map(provider => (
                  <StreamingServiceIcon key={provider.provider_id} id={provider.provider_id} size={24} />
                ))}
              </View> */}
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
  },
  cardContent: {
    flexDirection: 'row',
    padding: 12,
  },
  poster: {
    width: 100,
    height: 150,
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
    height: 24,
  },
  genreText: {
    fontSize: 10,
  },
  overview: {
    marginTop: 8,
  },
  providersContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
});
