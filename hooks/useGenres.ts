import { useQuery } from '@tanstack/react-query';
import { tmdbService } from '../services/tmdbService';
import { Genre } from '../types';

export const useGenres = () => {
  const { data: genres, isLoading, error, refetch } = useQuery<Genre[]>({
    queryKey: ['genres'],
    queryFn: async () => {
      return tmdbService.getCombinedGenres();
    },
    staleTime: 24 * 60 * 60 * 1000, // 24 hours - genres don't change often
  });

  return {
    genres: genres || [],
    isLoading,
    error,
    refetch,
  };
}; 