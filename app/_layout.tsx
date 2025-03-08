import { Stack } from 'expo-router';
import { Provider as PaperProvider } from 'react-native-paper';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, useTheme } from '../context/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Create a client for React Query
const queryClient = new QueryClient();

// Layout component that uses the theme
function AppLayout() {
  const { theme, isDarkMode } = useTheme();
  
  return (
    <PaperProvider theme={theme}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: true,
          headerStyle: {
            backgroundColor: theme.colors.primary,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          contentStyle: {
            backgroundColor: theme.colors.background,
          },
        }}
      />
    </PaperProvider>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AppLayout />
        </ThemeProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
