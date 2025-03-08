import { useQuery, useQueryClient } from '@tanstack/react-query';
import { tmdbService } from '../services/tmdbService';
import { usePreferences } from './usePreferences';
import { MediaItem, SortConfig } from '../types';
import { useEffect, useCallback } from 'react';

export const useRecommendations = (
  page = 1,
  mediaType: 'movie' | 'tv' | 'both' = 'both',
  genreId?: number,
  sortConfig?: SortConfig
) => {
  const { preferences, loading: preferencesLoading } = usePreferences();
  const queryClient = useQueryClient();
  
  // Convert the selected service IDs to the format needed for the TMDB API
  const watchProvidersParam = preferences?.selectedServiceIds?.length > 0
    ? preferences.selectedServiceIds.join('|')
    : undefined;
  
  // Check specifically for Amazon Prime Video
  useEffect(() => {
    if (preferences?.selectedServiceIds?.includes(119)) {
      console.log('Amazon Prime Video (ID: 119) is selected in user preferences');
    } else {
      console.log('Amazon Prime Video is NOT in selected services', preferences?.selectedServiceIds);
    }
  }, [preferences?.selectedServiceIds]);
  
  // Get year range from preferences with null checks
  const startYear = preferences?.yearRange?.startYear;
  const endYear = preferences?.yearRange?.endYear;
  
  // Fetch movie recommendations
  const moviesQuery = useQuery({
    queryKey: ['movies', 'recommendations', {
      page,
      watchProviders: watchProvidersParam,
      genreId,
      startYear,
      endYear,
      sortOption: sortConfig?.option,
      sortDirection: sortConfig?.direction
    }],
    queryFn: async () => {
      const params: any = {};
      
      if (genreId) {
        params.with_genres = genreId.toString();
        console.log(`Fetching movies with genre ID: ${genreId}`);
      }
      
      // Add sort_by parameter if sortConfig is provided
      if (sortConfig) {
        // For movies, we need to map release_date to primary_release_date
        const sortBy = sortConfig.option === 'release_date' ? 'primary_release_date' : sortConfig.option;
        params.sort_by = `${sortBy}.${sortConfig.direction}`;
      }
      
      // Log watch providers parameter for debugging
      if (watchProvidersParam) {
        console.log(`Watch providers for movies API call: ${watchProvidersParam}`);
        console.log('Providers array:', JSON.stringify(preferences?.selectedServiceIds));
        
        // Check specifically for Amazon Prime
        if (preferences?.selectedServiceIds?.includes(119)) {
          console.log('Confirming Amazon Prime is included in API call');
        }
      }
      
      console.log('Movie API params:', params);
      
      return tmdbService.getPopularMovies(
        page, 
        watchProvidersParam, 
        startYear, 
        endYear,
        params
      );
    },
    enabled: (mediaType === 'movie' || mediaType === 'both') && !preferencesLoading,
    staleTime: 60 * 1000, // 1 minute
  });

  // Fetch TV show recommendations
  const tvShowsQuery = useQuery({
    queryKey: ['tv', 'recommendations', {
      page,
      watchProviders: watchProvidersParam,
      genreId,
      startYear,
      endYear,
      sortOption: sortConfig?.option,
      sortDirection: sortConfig?.direction
    }],
    queryFn: async () => {
      const params: any = {};
      
      if (genreId) {
        params.with_genres = genreId.toString();
        console.log(`Fetching TV shows with genre ID: ${genreId}`);
      }
      
      // Add sort_by parameter if sortConfig is provided
      if (sortConfig) {
        // For TV shows, we need to map release_date to first_air_date
        const sortBy = sortConfig.option === 'release_date' ? 'first_air_date' : sortConfig.option;
        params.sort_by = `${sortBy}.${sortConfig.direction}`;
      }
      
      console.log('TV API params:', params);
      
      return tmdbService.getPopularTVShows(
        page, 
        watchProvidersParam, 
        startYear, 
        endYear,
        params
      );
    },
    enabled: (mediaType === 'tv' || mediaType === 'both') && !preferencesLoading,
    staleTime: 60 * 1000, // 1 minute
  });

  // Force refetch when parameters change
  useEffect(() => {
    console.log('Parameters changed, invalidating queries');
    queryClient.invalidateQueries({ queryKey: ['movies', 'recommendations'] });
    queryClient.invalidateQueries({ queryKey: ['tv', 'recommendations'] });
  }, [watchProvidersParam, genreId, startYear, endYear, sortConfig, queryClient]);

  // Combine results from both queries when both are enabled
  const combineResults = (): MediaItem[] => {
    const movieResults = moviesQuery.data?.results || [];
    const tvResults = tvShowsQuery.data?.results || [];
    
    console.log(`Combining results: ${movieResults.length} movies and ${tvResults.length} TV shows`);
    
    if (mediaType === 'movie') return movieResults;
    if (mediaType === 'tv') return tvResults;
    
    // For 'both', combine and sort based on sortConfig
    const combined = [...movieResults, ...tvResults];
    
    if (sortConfig) {
      return sortMediaItems(combined, sortConfig);
    }
    
    // Default sort by vote_average if no sortConfig provided
    return combined.sort((a, b) => b.vote_average - a.vote_average);
  };

  // Helper function to sort media items
  const sortMediaItems = (items: MediaItem[], config: SortConfig): MediaItem[] => {
    return [...items].sort((a, b) => {
      let valueA: any;
      let valueB: any;
      
      switch (config.option) {
        case 'vote_average':
          valueA = a.vote_average || 0;
          valueB = b.vote_average || 0;
          break;
        case 'popularity':
          valueA = a.popularity || 0;
          valueB = b.popularity || 0;
          break;
        case 'release_date':
          // Handle different date fields for movies and TV shows
          valueA = a.media_type === 'movie' ? a.release_date : a.first_air_date;
          valueB = b.media_type === 'movie' ? b.release_date : b.first_air_date;
          
          // Convert to Date objects for comparison
          valueA = valueA ? new Date(valueA).getTime() : 0;
          valueB = valueB ? new Date(valueB).getTime() : 0;
          break;
        case 'vote_count':
          valueA = a.vote_count || 0;
          valueB = b.vote_count || 0;
          break;
        default:
          valueA = a.vote_average || 0;
          valueB = b.vote_average || 0;
      }
      
      // Sort based on direction
      return config.direction === 'asc' 
        ? valueA - valueB 
        : valueB - valueA;
    });
  };

  const isLoading = preferencesLoading || 
    (mediaType === 'movie' ? moviesQuery.isPending : false) || 
    (mediaType === 'tv' ? tvShowsQuery.isPending : false) ||
    (mediaType === 'both' ? (moviesQuery.isPending || tvShowsQuery.isPending) : false);

  const error = moviesQuery.error || tvShowsQuery.error || null;

  // Function to refetch data
  const refetch = () => {
    console.log('Manually refetching recommendations with:', {
      mediaType,
      genreId,
      page,
      watchProvidersCount: watchProvidersParam ? watchProvidersParam.split('|').length : 0,
      watchProvidersValue: watchProvidersParam,
      yearRange: `${startYear || 'none'}-${endYear || 'none'}`,
      sortOption: sortConfig?.option || 'default',
      sortDirection: sortConfig?.direction || 'default'
    });
    
    // Force invalidate caches first
    queryClient.invalidateQueries({ queryKey: ['movies', 'recommendations'] });
    queryClient.invalidateQueries({ queryKey: ['tv', 'recommendations'] });
    
    // Then refetch the data
    if (mediaType === 'movie' || mediaType === 'both') {
      console.log('Refetching movies data');
      moviesQuery.refetch();
    }
    if (mediaType === 'tv' || mediaType === 'both') {
      console.log('Refetching TV shows data');
      tvShowsQuery.refetch();
    }
  };

  // Log the current state for debugging
  useEffect(() => {
    console.log('useRecommendations rendered with:', {
      mediaType,
      genreId,
      page,
      isLoading,
      watchProvidersCount: watchProvidersParam ? watchProvidersParam.split('|').length : 0,
      yearRange: `${startYear || 'none'}-${endYear || 'none'}`,
      hasMovieData: !!moviesQuery.data,
      hasTVData: !!tvShowsQuery.data,
      movieResults: moviesQuery.data?.results?.length || 0,
      tvResults: tvShowsQuery.data?.results?.length || 0,
      combinedResults: combineResults().length
    });
  }, [mediaType, genreId, page, watchProvidersParam, startYear, endYear, isLoading, moviesQuery.data, tvShowsQuery.data]);

  return {
    recommendations: combineResults(),
    isLoading,
    error,
    totalPages: Math.max(
      moviesQuery.data?.total_pages || 0,
      tvShowsQuery.data?.total_pages || 0
    ),
    currentPage: page,
    refetch,
  };
};
