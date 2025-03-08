## Year Range Filtering Implementation

* Implement year range filtering as part of the UserPreferences interface
* Use a slider component for intuitive year range selection in the settings screen
* For React Native Paper projects, use @react-native-community/slider as React Native Paper doesn't provide a Slider component
* Ensure proper validation of year inputs:
  * Start year should never be greater than end year
  * Use Math.floor() to ensure integer values when working with sliders
  * Set reasonable minimum (e.g., 1900) and maximum (current year) values
* Update API service methods to include year range parameters:
  * For movies, use primary_release_date_gte and primary_release_date_lte parameters
  * For TV shows, use first_air_date_gte and first_air_date_lte parameters
  * Format dates as YYYY-MM-DD strings for API compatibility
* Update query keys in React Query hooks to include year range parameters
* Provide visual feedback about active year filters in search and recommendation screens
* Consider the UX implications of year filtering:
  * Show the current filter values to users
  * Explain why certain results might be missing due to filters
  * Allow easy resetting of filters to default values
* Test year range filtering on all supported platforms to ensure consistent behavior
* Ensure the year range state persists across app restarts using AsyncStorage
* Use proper type safety with TypeScript for all year range related code
* Consider performance implications when adding multiple filter parameters to API requests 