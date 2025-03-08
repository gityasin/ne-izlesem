import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Searchbar, Text, ActivityIndicator } from 'react-native-paper';
import { Stack } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { tmdbService } from '../services/tmdbService';
import { MediaCard } from '../components/MediaCard';
import { usePreferences } from '../hooks/usePreferences';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const { preferences } = usePreferences();

  // Get year range from preferences
  const startYear = preferences.yearRange?.startYear;
  const endYear = preferences.yearRange?.endYear;

  const { data, isLoading, error } = useQuery({
    queryKey: ['search', submittedQuery, startYear, endYear],
    queryFn: () => tmdbService.searchMedia(submittedQuery, 1, startYear, endYear),
    enabled: !!submittedQuery,
  });

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setSubmittedQuery(searchQuery.trim());
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Ara' }} />
      
      <Searchbar
        placeholder="Film veya dizi ara..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        onSubmitEditing={handleSearch}
        style={styles.searchBar}
      />
      
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Aranıyor...</Text>
        </View>
      )}
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Arama yapılırken bir hata oluştu. Lütfen daha sonra tekrar deneyin.
          </Text>
        </View>
      )}
      
      {!isLoading && !error && submittedQuery && data?.results.length === 0 && (
        <View style={styles.noResultsContainer}>
          <Text style={styles.noResultsText}>
            "{submittedQuery}" için sonuç bulunamadı.
          </Text>
          {(startYear || endYear) && (
            <Text style={styles.filterInfo}>
              Not: Arama sonuçları {startYear || 1900} - {endYear || new Date().getFullYear()} yılları arasındaki içeriklerle sınırlandırılmıştır.
            </Text>
          )}
        </View>
      )}
      
      {!isLoading && !error && data?.results && data.results.length > 0 && (
        <FlatList
          data={data.results}
          keyExtractor={(item) => `${item.id}-${item.media_type || 'movie'}`}
          renderItem={({ item }) => <MediaCard item={item} />}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            (startYear || endYear) ? (
              <View style={styles.filterInfoContainer}>
                <Text style={styles.filterInfo}>
                  Sonuçlar {startYear || 1900} - {endYear || new Date().getFullYear()} yılları arasındaki içeriklerle sınırlandırılmıştır.
                </Text>
              </View>
            ) : null
          }
        />
      )}
      
      {!submittedQuery && (
        <View style={styles.initialStateContainer}>
          <Text style={styles.initialStateText}>
            Film veya dizi adı girerek arama yapabilirsiniz.
          </Text>
          {(startYear || endYear) && (
            <Text style={styles.filterInfo}>
              Not: Arama sonuçları {startYear || 1900} - {endYear || new Date().getFullYear()} yılları arasındaki içeriklerle sınırlandırılacaktır.
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchBar: {
    margin: 16,
    elevation: 2,
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
    color: 'red',
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noResultsText: {
    textAlign: 'center',
  },
  initialStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  initialStateText: {
    textAlign: 'center',
    color: '#757575',
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 16,
  },
  filterInfoContainer: {
    padding: 16,
    paddingTop: 0,
    paddingBottom: 8,
  },
  filterInfo: {
    textAlign: 'center',
    color: '#757575',
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 8,
  },
});
