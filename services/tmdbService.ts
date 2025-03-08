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
    
    if (with_watch_providers) {
      params.with_watch_providers = with_watch_providers;
      params.watch_region = 'TR';
    }
    
    // Add year range filtering
    if (startYear) {
      params.primary_release_date_gte = `${startYear}-01-01`;
    }
    
    if (endYear) {
      params.primary_release_date_lte = `${endYear}-12-31`;
    }
    
    console.log('Making API call to /movie/popular with params:', params);
    
    const response = await tmdbApi.get<TMDBResponse<MediaItem>>('/movie/popular', { params });
    
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
    
    if (with_watch_providers) {
      params.with_watch_providers = with_watch_providers;
      params.watch_region = 'TR';
    }
    
    // Add year range filtering
    if (startYear) {
      params.first_air_date_gte = `${startYear}-01-01`;
    }
    
    if (endYear) {
      params.first_air_date_lte = `${endYear}-12-31`;
    }
    
    console.log('Making API call to /tv/popular with params:', params);
    
    const response = await tmdbApi.get<TMDBResponse<MediaItem>>('/tv/popular', { params });
    
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
      const response = await tmdbApi.get<WatchProviderResponse>('/watch/providers/movie', {
        params: {
          watch_region: 'TR',
        },
      });
      
      // Ensure we have valid data
      if (!response.data || !response.data.results || !Array.isArray(response.data.results)) {
        console.error('Invalid watch provider data format:', response.data);
        return [];
      }
      
      return response.data.results;
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
};
