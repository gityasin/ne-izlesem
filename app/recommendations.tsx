import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Text, ActivityIndicator, Button, Chip, Menu, Divider } from 'react-native-paper';
import { Stack } from 'expo-router';
import { MediaCard } from '../components/MediaCard';
import { useRecommendations } from '../hooks/useRecommendations';
import { useTheme } from '../context/ThemeContext';
import { SortConfig, SortOption } from '../types';
import i18n from '../localization/i18n';
import { useGenres } from '../hooks/useGenres';

// Sorting options
const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'vote_average', label: i18n.t('sort.imdbRating') },
  { value: 'popularity', label: i18n.t('sort.popularity') },
  { value: 'release_date', label: i18n.t('sort.releaseDate') },
  { value: 'vote_count', label: i18n.t('sort.voteCount') },
];

type MediaTypeFilter = 'both' | 'movie' | 'tv';

export default function RecommendationsScreen() {
  const { theme } = useTheme();
  const [page, setPage] = useState(1);
  const [selectedGenreId, setSelectedGenreId] = useState<number | undefined>(undefined);
  const [mediaTypeFilter, setMediaTypeFilter] = useState<MediaTypeFilter>('both');
  const [mediaTypeMenuVisible, setMediaTypeMenuVisible] = useState(false);
  const [sortMenuVisible, setSortMenuVisible] = useState(false);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    option: 'vote_average',
    direction: 'desc'
  });

  // Fetch genres using the useGenres hook
  const { genres, isLoading: isLoadingGenres } = useGenres();

  // Use the recommendations hook with all filters
  const { 
    recommendations, 
    isLoading: isLoadingRecommendations, 
    error, 
    totalPages, 
    refetch 
  } = useRecommendations(
    page,
    mediaTypeFilter,
    selectedGenreId,
    sortConfig
  );

  // Combine loading states
  const isLoading = isLoadingRecommendations || isLoadingGenres;

  // Reset page and refetch when filters change
  useEffect(() => {
    console.log('Filter changed - selectedGenreId:', selectedGenreId, 'mediaType:', mediaTypeFilter);
    
    if (page === 1) {
      console.log('Refetching data with current page:', page);
      refetch();
    } else {
      console.log('Resetting page to 1 from:', page);
      setPage(1);
    }
  }, [selectedGenreId, mediaTypeFilter, sortConfig, refetch, page]);

  // Log recommendations for debugging
  useEffect(() => {
    console.log('Recommendations updated:', {
      count: recommendations?.length || 0,
      firstItem: recommendations?.[0]?.title || recommendations?.[0]?.name || 'none',
      selectedGenreId
    });
  }, [recommendations, selectedGenreId]);

  const handleGenreSelect = useCallback((genreId: number) => {
    // Toggle the genre selection
    setSelectedGenreId(prevGenreId => {
      const newGenreId = prevGenreId === genreId ? undefined : genreId;
      console.log(`Genre selection changed from ${prevGenreId} to ${newGenreId}`);
      return newGenreId;
    });
  }, []);

  const handleMediaTypeSelect = useCallback((type: MediaTypeFilter) => {
    setMediaTypeFilter(type);
    setMediaTypeMenuVisible(false);
  }, []);

  const handleSortSelect = useCallback((option: SortOption) => {
    setSortConfig(prev => ({
      option,
      direction: prev.option === option ? (prev.direction === 'desc' ? 'asc' : 'desc') : 'desc'
    }));
    setSortMenuVisible(false);
  }, []);

  const getSortLabel = () => {
    const option = SORT_OPTIONS.find(opt => opt.value === sortConfig.option);
    const directionIcon = sortConfig.direction === 'desc' ? '↓' : '↑';
    return `${option?.label || ''} ${directionIcon}`;
  };

  // Handle pagination
  const handleLoadMore = () => {
    if (!isLoading && page < totalPages) {
      setPage(prevPage => prevPage + 1);
    }
  };

  if (isLoading && page === 1) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>
          {i18n.t('recommendations.loading')}
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.errorText, { color: theme.colors.text }]}>
          {i18n.t('recommendations.error')}
        </Text>
        <Button mode="contained" onPress={() => refetch()}>
          {i18n.t('recommendations.tryAgain')}
        </Button>
      </View>
    );
  }

  const getMediaTypeLabel = () => {
    switch (mediaTypeFilter) {
      case 'movie': return i18n.t('recommendations.contentTypes.movies');
      case 'tv': return i18n.t('recommendations.contentTypes.tvShows');
      default: return i18n.t('recommendations.contentTypes.all');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Stack.Screen options={{ title: i18n.t('recommendations.title') }} />

      <View style={styles.filtersContainer}>
        <View style={styles.filterRow}>
          <View style={styles.filterItem}>
            <Text variant="labelMedium" style={{ color: theme.colors.text }}>
              {i18n.t('recommendations.contentType')}
            </Text>
            <Menu
              visible={mediaTypeMenuVisible}
              onDismiss={() => setMediaTypeMenuVisible(false)}
              anchor={
                <Button 
                  mode="outlined" 
                  onPress={() => setMediaTypeMenuVisible(true)}
                  style={styles.filterButton}
                >
                  {getMediaTypeLabel()}
                </Button>
              }
            >
              <Menu.Item 
                onPress={() => handleMediaTypeSelect('both')} 
                title={i18n.t('recommendations.contentTypes.all')} 
              />
              <Menu.Item 
                onPress={() => handleMediaTypeSelect('movie')} 
                title={i18n.t('recommendations.contentTypes.movies')} 
              />
              <Menu.Item 
                onPress={() => handleMediaTypeSelect('tv')} 
                title={i18n.t('recommendations.contentTypes.tvShows')} 
              />
            </Menu>
          </View>

          <View style={styles.filterItem}>
            <Text variant="labelMedium" style={{ color: theme.colors.text }}>
              {i18n.t('recommendations.sort')}
            </Text>
            <Menu
              visible={sortMenuVisible}
              onDismiss={() => setSortMenuVisible(false)}
              anchor={
                <Button 
                  mode="outlined" 
                  onPress={() => setSortMenuVisible(true)}
                  style={styles.filterButton}
                >
                  {getSortLabel()}
                </Button>
              }
            >
              {SORT_OPTIONS.map((option) => (
                <Menu.Item 
                  key={option.value}
                  onPress={() => handleSortSelect(option.value)} 
                  title={option.label}
                  trailingIcon={sortConfig.option === option.value ? 
                    (sortConfig.direction === 'desc' ? 'arrow-down' : 'arrow-up') : undefined}
                />
              ))}
            </Menu>
          </View>
        </View>

        <Divider style={styles.divider} />

        <Text variant="labelMedium" style={[styles.genresLabel, { color: theme.colors.text }]}>
          {i18n.t('recommendations.genre')}
        </Text>
        {isLoadingGenres ? (
          <ActivityIndicator size="small" color={theme.colors.primary} style={styles.genresLoader} />
        ) : (
          <FlatList
            data={genres}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <Chip
                mode="outlined"
                selected={selectedGenreId === item.id}
                style={styles.genreChip}
                onPress={() => handleGenreSelect(item.id)}
                selectedColor={theme.colors.primary}
              >
                {item.name}
              </Chip>
            )}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.genresList}
          />
        )}
      </View>

      {recommendations && recommendations.length > 0 ? (
        <FlatList
          data={recommendations}
          renderItem={({ item }) => <MediaCard item={item} />}
          keyExtractor={(item) => `${item.id}-${item.media_type}`}
          contentContainerStyle={styles.recommendationsList}
          numColumns={2}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isLoading && page > 1 ? (
              <ActivityIndicator 
                size="small" 
                color={theme.colors.primary} 
                style={styles.loadMoreIndicator} 
              />
            ) : null
          }
        />
      ) : (
        <View style={styles.noResultsContainer}>
          <Text style={{ color: theme.colors.text }}>
            {i18n.t('recommendations.noResults')}
          </Text>
          <Button mode="contained" onPress={() => refetch()} style={styles.retryButton}>
            {i18n.t('recommendations.tryAgain')}
          </Button>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginBottom: 16,
    textAlign: 'center',
  },
  filtersContainer: {
    padding: 12,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  filterItem: {
    flex: 1,
    marginHorizontal: 4,
    minWidth: 150,
    marginBottom: 8,
  },
  filterButton: {
    marginTop: 4,
    height: 40,
    justifyContent: 'center',
  },
  genresLabel: {
    marginBottom: 8,
  },
  genresList: {
    paddingBottom: 8,
  },
  genreChip: {
    marginRight: 8,
    marginBottom: 8,
    height: 36,
    paddingHorizontal: 12,
  },
  recommendationsList: {
    padding: 8,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  divider: {
    marginVertical: 12,
  },
  loadMoreIndicator: {
    marginVertical: 16,
  },
  genresLoader: {
    marginTop: 8,
  },
  retryButton: {
    marginTop: 16,
  },
});
