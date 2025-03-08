// Types for TMDB API responses and app data structures

export interface StreamingService {
  provider_id: number;
  id?: number; // Keep for backward compatibility
  provider_name: string;
  logo_path: string;
  display_priorities?: {
    [country: string]: number;
  };
  display_priority?: number;
}

export interface MediaItem {
  id: number;
  title?: string;                // For movies
  name?: string;                 // For TV shows
  original_title?: string;       // For movies
  original_name?: string;        // For TV shows
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  genre_ids: number[];
  vote_average: number;
  vote_count: number;            // Added for sorting
  popularity: number;            // Added for sorting
  release_date?: string;         // For movies
  first_air_date?: string;       // For TV shows
  media_type?: 'movie' | 'tv';
  watch_providers?: {
    results?: {
      [country: string]: {
        flatrate?: { provider_id: number }[];
        rent?: { provider_id: number }[];
        buy?: { provider_id: number }[];
      };
    };
  };
}

export interface TMDBResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface UserPreferences {
  selectedServiceIds: number[];
  yearRange?: {
    startYear: number;
    endYear: number;
  };
  themeMode?: 'light' | 'dark' | 'system';
}

export interface Genre {
  id: number;
  name: string;
}

export interface DetailedMediaItem extends MediaItem {
  genres: Genre[];
  runtime?: number;          // For movies (in minutes)
  episode_run_time?: number[]; // For TV shows
  number_of_seasons?: number;  // For TV shows
  number_of_episodes?: number; // For TV shows
  status: string;
  tagline?: string;
  vote_count: number;
  credits?: {
    cast: {
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
      order: number;
    }[];
    crew: {
      id: number;
      name: string;
      job: string;
      department: string;
      profile_path: string | null;
    }[];
  };
}

export interface WatchProviderResponse {
  results: StreamingService[];
}

export type SortOption = 'vote_average' | 'popularity' | 'release_date' | 'vote_count';

export interface SortConfig {
  option: SortOption;
  direction: 'asc' | 'desc';
}
