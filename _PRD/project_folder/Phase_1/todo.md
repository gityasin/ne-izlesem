# Todo List - Ne İzlesem? Phase 1 (MVP)

## 1. Project Setup
- [x] Create a new Expo project with TypeScript template
- [x] Set up Expo Router
- [x] Install necessary dependencies (react-native-paper, axios, react-query, i18n-js, AsyncStorage, supabase-js)
- [x] Configure TypeScript
- [x] Create folder structure (screens, components, services, hooks, context, utils, types, constants, localization)
- [x] Set up environment variables for TMDB API key

## 2. TMDB API Integration
- [x] Create tmdbService.ts with proper TypeScript interfaces
- [x] Implement API functions for:
  - [x] Getting popular movies with streaming filters
  - [x] Getting popular TV shows with streaming filters
  - [x] Getting movie details
  - [x] Getting TV show details
  - [x] Searching for media
  - [x] Getting available watch providers in Turkey
- [x] Implement error handling and loading states
- [x] Set up caching of API responses with react-query

## 3. Streaming Service Selection
- [x] Create SettingsScreen component
- [x] Implement the getWatchProviders API call with real data (currently using dummy data)
- [x] Create usePreferences hook for managing user preferences
- [x] Implement AsyncStorage functionality to save/retrieve selected streaming services
- [x] Build the UI for selecting streaming services

## 4. Recommendation Logic
- [x] Create useRecommendations hook
- [x] Implement logic to fetch recommendations based on selected streaming services
- [x] Add filtering by genre capability
- [x] Handle loading and error states
- [x] Optimize for performance

## 5. UI Components
- [x] Create MediaCard component
- [x] Create StreamingServiceIcon component
- [x] Create RatingStars component
- [x] Create Loader component
- [x] Create ErrorMessage component
- [x] Create any other necessary reusable UI components

## 6. Screens
- [x] Build HomeScreen with recommendation display and pagination
- [x] Implement DetailsScreen for showing movie/TV show details
- [x] Create SearchScreen with search functionality
- [x] Complete SettingsScreen for streaming service selection
- [x] Create navigation between screens using Expo Router

## 7. Localization
- [x] Set up i18n-js
- [x] Create tr.json file with Turkish translations
- [x] Create en.json file with English translations as fallback
- [x] Implement language detection with expo-localization
- [x] Apply translations throughout the app (partially complete, some screens still use hardcoded text)

## 8. Improvements (top priority)
- [x] Changing categories in suggestions doesn't work. we are making API calls but we still display the sample data on suggestions secreen (top priority) -We have been trying to fix this this for a while now. Check memory to see what we've tried so far.
- [x] Changing categories or streaming services doesn't change the titles displayed on the suggestions screen. It shows the same titles always. (top priority)
- [x] Media cards are not responsive. They are not scaling down to the size of the screen. Also they don't have dark theme applied to them. (top priority)
- [x] UI boxes in suggestions page doesn't fit the text in them on mobile.
- [x] Most popular streaming services should be at the top in order: Netflix, Amazon Prime Video, Disney+, HBO Max, Apple TV+, Youtube, BluTV, Puhu TV, Gain, Exxen, TOD, TV+, MUBI/ currently tabii and todtv are closer to bottom.
- [x] I want sorting options like IMBD rating, Popularity, Release date, etc.
- [x] Streaming servislerini seç is the name of our settings screen. change the file name to reflect that. It shouldn't be called settings.
- [x] Add a real settings screen. Gear icon should be at the top right corner of the homepage. It should have dark mode toggle at the top and then the year range slider.
- [x] Improve the homepage UX and general UI. Use shadcn UI components. Make sure texts are readable and the UI is pleasent and consistent accross pages.
- [x] Add dark mode support.
- [x] The gear icon is not clickable on mobile. we tried to fix this but it's not working.
- [x] We don't seem to fetch shows from amazon prime.

## 9. Testing (do not do these for now)
- [ ] Write unit tests for services and hooks
- [ ] Write component tests for UI components
- [ ] Test the app on different devices and screen sizes
- [ ] Perform error handling tests

## 10. Finalization for MVP (do not do these for now)
- [x] Replace dummy/placeholder data with real API data
- [ ] Conduct final quality checks
- [ ] Fix any remaining bugs or issues
- [ ] Optimize performance
- [ ] Prepare for app submission (if applicable)