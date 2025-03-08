import axios from 'axios';
import { ENV } from '../constants/.env';
import { 
  MediaItem, 
  TMDBResponse, 
  DetailedMediaItem,
  WatchProviderResponse,
  StreamingService,
  Genre
} from '../types';

const tmdbApi = axios.create({
  baseURL: ENV.TMDB_BASE_URL,
  params: {
    api_key: ENV.TMDB_API_KEY,
    language: 'tr-TR', // Set Turkish as default language
    region: 'TR',     // Set Turkey as default region
  },
});

// Handle API request errors
tmdbApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('TMDB API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const tmdbService = {
  // Get popular movies with optional streaming service filtering
  getPopularMovies: async (
    page = 1, 
    with_watch_providers?: string,
    startYear?: number,
    endYear?: number,
    additionalParams: Record<string, any> = {}
  ): Promise<TMDBResponse<MediaItem>> => {
    const params: any = { page, ...additionalParams };
    
    // Use discover endpoint if we have filtering parameters
    const endpoint = (with_watch_providers || startYear || endYear || additionalParams.with_genres || additionalParams.sort_by) 
      ? '/discover/movie' 
      : '/movie/popular';
    
    if (with_watch_providers) {
      // TMDB API requires brackets around watch providers for the discover endpoint
      if (endpoint === '/discover/movie') {
        // Remove any potential formatting issues in the string
        const cleanProviders = with_watch_providers.split('|')
          .map(id => id.trim())
          .filter(id => id !== '')
          .join('|');
        
        params.with_watch_providers = cleanProviders;
      } else {
        params.with_watch_providers = with_watch_providers;
      }
      params.watch_region = 'TR';
    }
    
    // Add year range filtering
    if (startYear) {
      params.primary_release_date_gte = `${startYear}-01-01`;
    }
    
    if (endYear) {
      params.primary_release_date_lte = `${endYear}-12-31`;
    }
    
    console.log(`Making API call to ${endpoint} with params:`, params);
    
    const response = await tmdbApi.get<TMDBResponse<MediaItem>>(endpoint, { params });
    
    console.log(`Received ${response.data.results.length} movies from API`);
    
    // Add media_type to each result
    const normalizedData: TMDBResponse<MediaItem> = {
      ...response.data,
      results: response.data.results.map(movie => ({
        ...movie,
        media_type: 'movie',
      })),
    };
    
    return normalizedData;
  },
  
  // Get popular TV shows with optional streaming service filtering
  getPopularTVShows: async (
    page = 1, 
    with_watch_providers?: string,
    startYear?: number,
    endYear?: number,
    additionalParams: Record<string, any> = {}
  ): Promise<TMDBResponse<MediaItem>> => {
    const params: any = { page, ...additionalParams };
    
    // Use discover endpoint if we have filtering parameters
    const endpoint = (with_watch_providers || startYear || endYear || additionalParams.with_genres || additionalParams.sort_by) 
      ? '/discover/tv' 
      : '/tv/popular';
    
    if (with_watch_providers) {
      // TMDB API requires brackets around watch providers for the discover endpoint
      if (endpoint === '/discover/tv') {
        // Remove any potential formatting issues in the string
        const cleanProviders = with_watch_providers.split('|')
          .map(id => id.trim())
          .filter(id => id !== '')
          .join('|');
        
        params.with_watch_providers = cleanProviders;
      } else {
        params.with_watch_providers = with_watch_providers;
      }
      params.watch_region = 'TR';
    }
    
    // Add year range filtering
    if (startYear) {
      params.first_air_date_gte = `${startYear}-01-01`;
    }
    
    if (endYear) {
      params.first_air_date_lte = `${endYear}-12-31`;
    }
    
    console.log(`Making API call to ${endpoint} with params:`, params);
    
    const response = await tmdbApi.get<TMDBResponse<MediaItem>>(endpoint, { params });
    
    console.log(`Received ${response.data.results.length} TV shows from API`);
    
    // Normalize TV show data to match our MediaItem interface
    const normalizedData: TMDBResponse<MediaItem> = {
      ...response.data,
      results: response.data.results.map(show => ({
        ...show,
        media_type: 'tv',
      })),
    };
    
    return normalizedData;
  },
  
  // Get movie details by ID
  getMovieDetails: async (id: number): Promise<DetailedMediaItem> => {
    const params = {
      append_to_response: 'credits,watch/providers',
    };
    
    const response = await tmdbApi.get<DetailedMediaItem>(`/movie/${id}`, { params });
    return {
      ...response.data,
      media_type: 'movie',
    };
  },
  
  // Get TV show details by ID
  getTVShowDetails: async (id: number): Promise<DetailedMediaItem> => {
    const params = {
      append_to_response: 'credits,watch/providers',
    };
    
    const response = await tmdbApi.get<DetailedMediaItem>(`/tv/${id}`, { params });
    return {
      ...response.data,
      media_type: 'tv',
    };
  },
  
  // Search for movies and TV shows
  searchMedia: async (
    query: string, 
    page = 1,
    startYear?: number,
    endYear?: number
  ): Promise<TMDBResponse<MediaItem>> => {
    const params: any = {
      query,
      page,
      include_adult: false,
    };
    
    // Add year range filtering
    if (startYear) {
      params.primary_release_year_gte = startYear;
      params.first_air_date_year_gte = startYear;
    }
    
    if (endYear) {
      params.primary_release_year_lte = endYear;
      params.first_air_date_year_lte = endYear;
    }
    
    const response = await tmdbApi.get<TMDBResponse<MediaItem>>('/search/multi', { params });
    
    // Filter results to only include movies and TV shows
    const filteredResults = response.data.results.filter(
      item => item.media_type === 'movie' || item.media_type === 'tv'
    );
    
    return {
      ...response.data,
      results: filteredResults,
    };
  },
  
  // Get available watch providers in Turkey
  getWatchProviders: async (): Promise<StreamingService[]> => {
    try {
      // Fetch both movie and TV providers
      const [movieProvidersResponse, tvProvidersResponse] = await Promise.all([
        tmdbApi.get<WatchProviderResponse>('/watch/providers/movie', {
          params: {
            watch_region: 'TR',
          },
        }),
        tmdbApi.get<WatchProviderResponse>('/watch/providers/tv', {
          params: {
            watch_region: 'TR',
          },
        })
      ]);
      
      // Ensure we have valid data for movies
      if (!movieProvidersResponse.data || !movieProvidersResponse.data.results || !Array.isArray(movieProvidersResponse.data.results)) {
        console.error('Invalid movie watch provider data format:', movieProvidersResponse.data);
        return [];
      }
      
      // Ensure we have valid data for TV shows
      if (!tvProvidersResponse.data || !tvProvidersResponse.data.results || !Array.isArray(tvProvidersResponse.data.results)) {
        console.error('Invalid TV watch provider data format:', tvProvidersResponse.data);
        return movieProvidersResponse.data.results; // Return just movie providers if TV providers fail
      }
      
      // Combine providers and remove duplicates
      const movieProviders = movieProvidersResponse.data.results;
      const tvProviders = tvProvidersResponse.data.results;
      
      // Log Amazon Prime details specifically to diagnose issues
      const amazonPrimeMovie = movieProviders.find(p => p.provider_id === 119 || p.provider_name.includes("Amazon Prime"));
      const amazonPrimeTV = tvProviders.find(p => p.provider_id === 119 || p.provider_name.includes("Amazon Prime"));
      
      console.log('Amazon Prime in movie providers:', amazonPrimeMovie ? 
        `Found (ID: ${amazonPrimeMovie.provider_id}, Name: ${amazonPrimeMovie.provider_name})` : 
        'Not found');
      
      console.log('Amazon Prime in TV providers:', amazonPrimeTV ? 
        `Found (ID: ${amazonPrimeTV.provider_id}, Name: ${amazonPrimeTV.provider_name})` : 
        'Not found');
      
      // Create a map to track providers by ID
      const providersMap = new Map<number, StreamingService>();
      
      // Add movie providers to the map
      movieProviders.forEach(provider => {
        providersMap.set(provider.provider_id, provider);
      });
      
      // Add TV providers to the map (will overwrite if already exists)
      tvProviders.forEach(provider => {
        providersMap.set(provider.provider_id, provider);
      });
      
      // Convert map back to array
      const combinedProviders = Array.from(providersMap.values());
      
      // Additional logging for Amazon Prime in final results
      const amazonPrimeFinal = combinedProviders.find(p => p.provider_id === 119);
      console.log('Amazon Prime in final providers list:', amazonPrimeFinal ? 
        `Found (ID: ${amazonPrimeFinal.provider_id}, Name: ${amazonPrimeFinal.provider_name})` : 
        'Not found');
      
      console.log(`Fetched ${movieProviders.length} movie providers and ${tvProviders.length} TV providers, combined into ${combinedProviders.length} unique providers`);
      
      return combinedProviders;
    } catch (error) {
      console.error('Error fetching watch providers:', error);
      return [];
    }
  },
  
  // Get genres list (movies and TV shows)
  getGenres: async (mediaType: 'movie' | 'tv' = 'movie') => {
    const response = await tmdbApi.get(`/genre/${mediaType}/list`);
    return response.data.genres;
  },

  // Get combined genres list for both movies and TV shows
  getCombinedGenres: async (): Promise<Genre[]> => {
    try {
      // Fetch both movie and TV genres
      const [movieGenresResponse, tvGenresResponse] = await Promise.all([
        tmdbApi.get('/genre/movie/list'),
        tmdbApi.get('/genre/tv/list')
      ]);
      
      const movieGenres = movieGenresResponse.data.genres || [];
      const tvGenres = tvGenresResponse.data.genres || [];
      
      // Combine genres and remove duplicates
      const allGenres = [...movieGenres];
      
      // Add TV genres that don't exist in movie genres
      tvGenres.forEach((tvGenre: Genre) => {
        if (!allGenres.some(genre => genre.id === tvGenre.id)) {
          allGenres.push(tvGenre);
        }
      });
      
      // Sort genres by name
      return allGenres.sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
      console.error('Error fetching genres:', error);
      return [];
    }
  },

  // Get watch providers for a specific movie or TV show
  getItemWatchProviders: async (id: number, mediaType: 'movie' | 'tv'): Promise<any> => {
    try {
      const response = await tmdbApi.get(`/${mediaType}/${id}/watch/providers`);
      
      // Ensure we have valid data
      if (!response.data || !response.data.results) {
        console.error(`Invalid watch provider data format for ${mediaType} ${id}:`, response.data);
        return null;
      }
      
      // Return the watch providers for Turkey (TR)
      return response.data.results.TR || null;
    } catch (error) {
      console.error(`Error fetching watch providers for ${mediaType} ${id}:`, error);
      return null;
    }
  },
};
