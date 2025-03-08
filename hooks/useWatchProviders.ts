import { useQuery } from '@tanstack/react-query';
import { tmdbService } from '../services/tmdbService';

export const useWatchProviders = (id: number, mediaType: 'movie' | 'tv') => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['watchProviders', mediaType, id],
    queryFn: () => tmdbService.getItemWatchProviders(id, mediaType),
    enabled: !!id && !!mediaType,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours - watch providers don't change often
  });

  return {
    providers: data,
    isLoading,
    error,
    // Return flatrate providers (subscription services) if available
    flatrateProviders: data?.flatrate || [],
    // Return rent providers if available
    rentProviders: data?.rent || [],
    // Return buy providers if available
    buyProviders: data?.buy || [],
  };
}; 