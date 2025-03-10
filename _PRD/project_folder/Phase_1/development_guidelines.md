# Development Guidelines - Ne İzlesem?

## General Development Rules

* This is a cross-platform project. It should work on web, android and iOS
* Always use powershell commands and read 200 lines while using the read_file tool
* You should do task-based development. For every task, you should write the tests, implement the code, and run the tests to make sure everything works. Use Jest and React Native Testing Library to run the tests.
* Check todo.md for tasks to do.

When the tests pass:

- Update the todo list to reflect the task being completed.
- Update the memory file to reflect the current state of the project.
- Update the project_structure file to reflect the changes to the project structure. make sure it's up to date with the current structure
- Fix any warnings or errors in the code.
- Commit the changes to the repository with a descriptive commit message.
- Update the development guidelines to reflect anything that you've learned while working on the project.
- Stop and we will open a new chat for the next task.

## Retain Memory

There will be a memory file for every project.

The memory file will contain the state of the project, and any notes or relevant details you'd need to remember between chats.

Keep it up to date based on the project's current state.

Do not annotate task completion in the memory file. It will be tracked in the to-do list.

## Update development guidelines

If necessary, update the development guidelines to reflect anything you've learned while working on the project.

## Specific Guidelines for this Project

- Use functional components and hooks.
- Use TypeScript for all code.
- Use `react-query` for data fetching, caching, and state management.
- Use `i18n-js` for localization.
- Follow Expo and React Native best practices.
- Use `react-native-paper` for UI components where possible.
- Write clear and concise code.
- Add comments to explain complex logic.
- Handle all errors gracefully and display user-friendly messages.
- Use async/await for asynchronous operations.

## Cross-Platform Compatibility

* Always test your code on multiple platforms (web, Android, iOS) to ensure compatibility.
* Be aware of platform-specific APIs and provide polyfills or alternative implementations when necessary.
* For web compatibility, ensure that browser APIs used by dependencies (like crypto) have appropriate polyfills.
* When using third-party libraries, check if they support all target platforms.
* Use platform-specific code sparingly and prefer cross-platform solutions when possible.
* Create platform-specific components when necessary using Platform.OS checks.
* For native modules that don't work on web, create wrapper components that provide alternative implementations.
* Use ScrollView with pagingEnabled as a fallback for PagerView on web platforms.
* Be cautious with libraries that use native modules as they may not work on all platforms without additional configuration.
* Check for platform-specific warnings and errors in the console and address them promptly.
* Use platform-specific file extensions (.web.tsx, .native.tsx, .ios.tsx, .android.tsx) for components that need different implementations per platform.
* Run `npx expo prebuild --clean` after installing native modules to ensure they are properly linked.
* For components that use native modules, create a common interface file (without platform extension) that exports the types and a placeholder component.

## Defensive Programming and Null Checking

* Always add null checks when accessing properties of objects that might be undefined, especially when working with:
  * API responses
  * User preferences
  * AsyncStorage data
  * Navigation parameters
* Use optional chaining (`?.`) to safely access nested properties that might be undefined
* Provide default values using the nullish coalescing operator (`??`) when a property might be null or undefined
* Add null checks before accessing array methods like `length`, `map`, `filter`, etc.
* Initialize state variables with appropriate default values to prevent undefined errors
* Validate user inputs and API responses before processing them
* Use TypeScript's non-null assertion operator (`!`) sparingly and only when you're absolutely certain a value is not null
* Add comprehensive error handling for all asynchronous operations
* Log errors with meaningful messages to aid in debugging
* Implement graceful degradation for critical functionality when external services are unavailable
* Test edge cases where data might be missing or malformed
* Consider using TypeScript's strict null checks mode to catch potential null reference errors at compile time

## Lessons Learned

### TMDB API
- Always include the `language=tr-TR` parameter to get Turkish content.
- For streaming service availability, use the `with_watch_providers` parameter along with `watch_region=TR`.
- The API returns different field names for movies (`title`, `original_title`) versus TV shows (`name`, `original_name`). Always handle both formats.
- When using the `/search/multi` endpoint, you should filter results to only include movies and TV shows, as it can also return people and other content types.
- The streaming service data from the TMDB API uses `provider_id` instead of `id`, so make sure your interfaces match this structure.
- Always validate API responses before using them, especially when dealing with nested properties that might be undefined.

### React Native & Expo
- When creating a project name, ensure it's URL-friendly (no spaces or special characters).
- The folder structure should be organized logically to separate concerns (services, components, screens, etc.).
- For Expo Router, remember to set up `main: "expo-router/entry"` in package.json.
- Always create a fallback UI for loading and error states.
- Use conditional rendering to handle different states (loading, error, empty results, etc.).
- When using FlatList, always provide a reliable keyExtractor function that handles potential undefined or null values.

### TypeScript
- Define comprehensive interfaces for all data structures, especially API responses.
- Use optional chaining (`?.`) and nullish coalescing (`??`) to handle potentially undefined values.
- Create utility types for shared data structures.
- Ensure your interfaces accurately reflect the actual data structure you're working with, especially when integrating with external APIs.

### Best Practices
- Implement pagination early to handle large datasets.
- Separate business logic from UI components using custom hooks.
- Use React Query's `useQuery` for data fetching with proper caching.
- Ensure all UI text is localized through the i18n system.
- Remember to handle device orientation changes and different screen sizes.
- Organize components to be reusable and maintainable.
- Implement comprehensive error handling at multiple levels (API service, component rendering, data processing).
- Always provide fallback values or alternative UI states when data might be missing or malformed.
- Use try/catch blocks when making API calls to gracefully handle errors.

## Lessons Learned from Recent Changes

### Screen Organization
- When renaming screens, make sure to update all references to the screen in other files, including navigation links.
- Use descriptive names for screens that reflect their purpose (e.g., "streaming-services" instead of generic "settings").
- Separate functionality into different screens when they serve distinct purposes (e.g., separate settings screen from streaming service selection).

### Navigation and UI
- Use the Stack.Screen component to configure screen-specific options like headers and navigation buttons.
- For common actions, consider adding navigation buttons to the header (e.g., settings gear icon).
- When implementing toggles like dark mode, prepare the infrastructure for theme management even if not fully implemented yet.
- Ensure all UI elements have appropriate spacing and visual hierarchy.

## Touch Targets on Mobile Devices

* Make touch targets large enough for comfortable interaction (at least 44x44 points)
* Use the hitSlop property to increase the touchable area without changing the visual size:
  ```jsx
  hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
  ```
* For IconButton components, set explicit width and height properties rather than relying only on the icon size:
  ```jsx
  style={{ 
    width: 48, 
    height: 48, 
    justifyContent: 'center', 
    alignItems: 'center' 
  }}
  ```
* Add proper padding around touch targets to prevent accidental taps on nearby elements
* Use accessibilityLabel props for better accessibility and testing:
  ```jsx
  accessibilityLabel={i18n.t('common.settings')}
  ```
* Test touch targets on actual mobile devices, not just in simulators
* Pay special attention to header buttons which can be harder to tap if they're too close to the edge or other UI elements
* For critical navigation elements, consider using Button instead of IconButton for a larger default touch area
* When using Link from expo-router with asChild, make sure the child component has a proper onPress handler
* Increase margin between interactive elements to prevent accidental taps on the wrong element
* Avoid unnecessary nesting of components inside touch targets as it can affect the touch area
* When using IconButton inside a Pressable, place it directly inside without intermediate View containers
* Remove position: 'relative' from touch targets as it can affect the touch area calculation
* Simplify the component hierarchy for touch targets to ensure proper propagation of touch events
* Use theme-aware ripple effects that adapt to light/dark mode:
  ```jsx
  android_ripple={{ 
    color: theme.dark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)', 
    radius: 28, 
    borderless: true 
  }}
  ```
* For icon buttons in headers, use a larger touch target (60x60) than the visual size of the icon
* Ensure the touch target is properly centered around the visual element
* Remove any margin or padding from the IconButton itself when it's inside a Pressable to prevent offset issues
* For complex touch target issues, prefer using a direct component approach rather than nested components
* When using IconButton from react-native-paper, set explicit width and height to ensure a consistent touch area
* Add testID props to touch targets for easier testing and debugging:
  ```jsx
  testID="settings-button"
  ```
* For header icons, consider using a direct IconButton component without any wrapper to avoid touch area issues
* When using Link from expo-router with IconButton, ensure the IconButton has an onPress handler (even if empty)
* Avoid using nested components with different layout properties that might conflict with each other
* For critical navigation elements, test the touch area on all target platforms (iOS, Android, web)
* When debugging touch area issues, try different component combinations to find the most reliable approach
* Remember that different platforms may handle touch areas differently, so test on all target platforms
* Use the simplest possible component structure that achieves the desired functionality
* For IconButton components, ensure the icon is properly centered within the touch target

## Platform-Specific Touch Target Implementation

* Use platform-specific implementations for critical UI elements like navigation buttons
* For Android:
  * Use Pressable with android_ripple for better touch feedback
  * Set explicit borderless: true for icon buttons to prevent background shape issues
  * Use theme-aware ripple colors that adapt to light/dark mode
  * Implement larger hitSlop values (at least 20px on all sides) for better touch targets
* For iOS:
  * IconButton from react-native-paper works well with proper styling
  * Adjust margin values to ensure proper positioning in the header
* For all platforms:
  * Ensure touch targets are at least 60x60 points for comfortable interaction
  * Use justifyContent: 'center' and alignItems: 'center' to properly center icons
  * Add proper accessibilityLabel for screen readers
  * Include testID for easier testing and debugging
  * Use direct navigation methods (router.push) instead of relying on Link component behavior
  * Implement consistent touch feedback (ripple on Android, opacity changes on iOS)
* When debugging touch target issues:
  * Test on actual devices, not just simulators
  * Try different component combinations (Pressable, TouchableOpacity, IconButton)
  * Use console.log to track touch events and component rendering
  * Simplify the component hierarchy to minimize potential issues
  * Consider using Platform.OS checks to implement platform-specific solutions

## API Debugging for Streaming Services

* Add detailed logging for API parameters before making requests to verify the correct format
* Use specific debugging for important providers (like Amazon Prime) to ensure they're properly included
* Use string splitting and joining to clean provider IDs before using them in API calls:
  ```typescript
  const cleanProviders = with_watch_providers.split('|')
    .map(id => id.trim())
    .filter(id => id !== '')
    .join('|');
  ```
* Check for proper provider inclusion using array methods:
  ```typescript
  if (preferences?.selectedServiceIds?.includes(119)) {
    console.log('Amazon Prime Video is selected');
  }
  ```
* For TMDB API, be aware that different endpoints have different requirements for formatting provider IDs
* Use the TMDB watch_region parameter to ensure results are filtered for the correct region
* When combining providers from movie and TV endpoints, use a Map to prevent duplicates
* Add null checks before accessing nested properties in API responses
* Consider the format differences between endpoints when structuring API parameters
* Log the final parameters and response data to help debug API issues
* For critical providers, add specific checks to ensure they're properly included in API calls
* When encountering issues with specific streaming services, test with a single provider ID first to isolate the problem

## Theme Management and Dark Mode

* Create a dedicated ThemeContext to manage theme state across the application
* Use React's Context API to provide theme values to all components
* Extend the MD3Theme from react-native-paper to create custom themes for light and dark modes
* Store theme preferences in AsyncStorage for persistence across app restarts
* Include a 'system' option that follows the device's theme preference using useColorScheme
* Add theme mode to the UserPreferences interface to keep all user preferences in one place
* Apply theme colors consistently across all components using the useTheme hook
* Use array syntax for styles to combine static styles with dynamic theme-based styles: `[styles.container, { backgroundColor: theme.colors.background }]`
* Update StatusBar style based on the current theme for a consistent look
* Provide visual feedback for the current theme mode in the settings screen
* When implementing dark mode, ensure all text has sufficient contrast against backgrounds
* Test the app in both light and dark modes to ensure all UI elements are visible and readable
* Remember to apply theme colors to all components, including third-party components like Slider
* Use theme.dark boolean to conditionally render elements based on the current theme

## Refactoring and Improving Hooks

* When implementing features that require refetching data, add a refetch function to the relevant hooks
* Use useEffect to trigger refetches when dependencies change
* Reset pagination to page 1 when filters change to ensure consistent data
* Add proper error handling for all asynchronous operations
* Implement comprehensive null checks to prevent runtime errors
* Use TypeScript to ensure type safety for all function parameters and return values
* Document complex logic with comments to improve maintainability
* Keep hooks focused on a single responsibility
* Expose only the necessary functions and values from hooks to maintain a clean API
* Use React Query's built-in refetch functionality for data fetching hooks

## Implementing Sorting and Filtering

* Define clear interfaces for sorting and filtering options to ensure type safety
* Use enums or string literals for sorting options to restrict possible values
* Implement sorting at the API level when possible for better performance
* For client-side sorting, create reusable sorting functions that handle different data types
* When sorting combined data from different sources (e.g., movies and TV shows), normalize the data first
* Provide a consistent UI for sorting controls across the application
* Use visual indicators (arrows, icons) to show the current sort direction
* Allow users to toggle between ascending and descending order
* Reset pagination when sorting or filtering criteria change
* Add proper null checks when accessing properties used for sorting
* For date-based sorting, convert string dates to Date objects for accurate comparison
* When implementing filters, consider the impact on API requests and optimize accordingly
* Use React Query's queryKey to include sorting and filtering parameters for proper cache management
* Provide sensible defaults for sorting options
* Ensure all sorting and filtering options are properly translated
* Test sorting with edge cases like missing values, null properties, or mixed data types

## Responsive UI Design for Mobile

* Use flexWrap: 'wrap' for rows of UI elements to ensure they adapt to different screen sizes
* Set minWidth for UI elements to prevent them from becoming too small on narrow screens
* Add appropriate padding and margins to ensure content is readable and accessible
* Use height and justifyContent properties to ensure buttons and interactive elements are properly sized
* Implement ScrollView for screens with potentially overflowing content
* Test UI on different screen sizes to ensure proper layout and readability
* Use relative units (percentages, flex) instead of fixed pixel values when possible
* Implement proper spacing between UI elements to prevent crowding on small screens
* Consider using different layouts for different screen orientations
* Ensure text is properly contained within its parent elements
* Use ellipsis or truncation for long text that might overflow containers
* Implement proper keyboard handling for input fields on mobile devices
* Test touch targets to ensure they are large enough for comfortable interaction (at least 44x44 points)
* Use Platform.OS checks for platform-specific styling when necessary

## Modern UI Design Patterns

* Use card-based designs for organizing related content into visually distinct sections
* Implement consistent elevation and shadows to create visual hierarchy
* Use surface variants to distinguish different sections of the UI
* Apply consistent spacing and padding throughout the application
* Use clear visual indicators for interactive elements
* Implement proper typography hierarchy with different text variants
* Use color to highlight important information and actions
* Ensure sufficient contrast between text and background colors
* Group related actions together in UI components
* Use icons consistently throughout the application
* Implement smooth transitions and animations for state changes
* Provide clear feedback for user actions
* Use empty states to guide users when no content is available
* Implement loading states to indicate when content is being fetched
* Use error states to communicate issues and provide recovery options
* Consider accessibility in all design decisions

## Debugging React Native Applications

* Add strategic console.log statements to track the flow of data and function calls
* Log API parameters before making requests to ensure they contain the expected values
* Log API responses to verify the data structure and content
* Use descriptive log messages that include relevant state variables
* When debugging state changes, log both the previous and new values
* For complex data structures, use JSON.stringify with indentation for better readability
* Group related logs together to make them easier to find in the console
* Use conditional logging to focus on specific issues without cluttering the console
* Remember to remove or disable debug logs before production deployment
* When debugging hooks, log the dependencies that trigger useEffect to run
* For React Query, log queryKey changes to understand when queries are invalidated
* Use React Query's built-in devtools in development mode for better debugging
* When debugging API calls, log both the request parameters and response data
* For pagination issues, log the current page and total pages values
* When debugging filters, log filter changes and their effect on API parameters

## API Integration Best Practices

* Normalize API responses to ensure consistent data structure throughout the application
* Add proper type annotations to API service functions and responses
* Use React Query for data fetching, caching, and state management
* Implement proper error handling for all API calls
* Add retry logic for transient failures
* Use staleTime and cacheTime appropriately to optimize performance
* Include proper loading states for all data fetching operations
* Implement pagination for large datasets
* Use queryKey arrays that include all parameters that affect the query
* Invalidate queries when related data changes
* Use prefetching for anticipated user actions
* Implement optimistic updates for better user experience
* Add proper null checks for all API response data
* Use TypeScript interfaces to ensure type safety for API responses
* Document API service functions with JSDoc comments
* Group related API calls in service modules
* Use environment variables for API keys and base URLs
* Implement proper logging for API calls in development
* Add proper error messages for failed API calls
* Use axios interceptors for global request/response handling

## React Query and useEffect Dependencies

* When using React Query with filters that can change, ensure proper refetching by:
  * Including all filter parameters in the queryKey array to trigger automatic refetches
  * Adding a dedicated useEffect to force refetch when critical filters change
  * Using the refetch function provided by useQuery to manually trigger refetches
  * Resetting pagination to page 1 when filters change to ensure consistent data
* Be careful with useEffect dependency arrays:
  * Include all variables that should trigger the effect when changed
  * For React Query hooks, include the refetch function in the dependency array
  * Add proper logging inside useEffect to track when and why it's being triggered
  * Consider splitting complex effects into multiple smaller effects with focused dependency arrays
* When debugging React Query issues:
  * Log the queryKey to ensure it's changing when filters change
  * Check if the query is enabled based on the current state
  * Verify that the data is being properly combined and processed after fetching
  * Add logging to track the flow of data from API call to UI rendering
* For filters that combine multiple data sources (like movies and TV shows):
  * Ensure both queries are properly triggered when filters change
  * Verify that the combined results are properly sorted and filtered
  * Add null checks before accessing properties of the query results
  * Consider using React Query's useQueries hook for multiple related queries
* When implementing UI for filters:
  * Provide clear visual feedback when filters are applied
  * Add loading indicators during refetching
  * Include retry buttons for error states
  * Log filter changes to help with debugging

## Consider performance implications when adding multiple filter parameters to API requests 

## Avoiding Hardcoded Data in Components

* Always use real data from API services instead of hardcoded sample data in components
* Use proper hooks to fetch and manage data from APIs
* When implementing new features, ensure that any sample or dummy data is replaced with real data before considering the feature complete
* For development and testing purposes, if you need to use sample data, clearly mark it with comments and create a task to replace it with real data
* When using sample data temporarily, structure it to match the expected API response format to minimize changes when switching to real data
* Use TypeScript interfaces to ensure consistency between sample data and real API responses
* Implement proper error handling and loading states for all data fetching operations
* Consider implementing fallback mechanisms for when API data is unavailable
* Document any assumptions made about the data structure in comments
* Test components with both real and sample data to ensure they work correctly in all scenarios
* When refactoring to use real data, ensure all references to sample data are removed throughout the codebase

## TMDB API Integration Best Practices

* When fetching watch providers, combine results from both movie and TV endpoints for a comprehensive list
* Use Promise.all to fetch data from multiple endpoints in parallel for better performance
* Implement proper error handling with fallback mechanisms when one API call fails
* Use Map objects to efficiently remove duplicates when combining data from multiple sources
* Add detailed logging to track API calls and responses for easier debugging
* Ensure all API parameters are properly formatted according to TMDB API requirements
* Use TypeScript interfaces to ensure type safety when working with API responses
* Implement proper null checks to handle unexpected API response formats
* Use the watch_region parameter to filter results by region (e.g., 'TR' for Turkey)
* When combining data from multiple sources, preserve the original data structure to maintain compatibility
* Consider caching frequently used data like genres and providers to reduce API calls
* Use staleTime in react-query to control how often data is refetched
* Implement proper loading and error states in the UI to provide feedback to the user
* Add console logging with meaningful messages to track the flow of data through the application
* When debugging API issues, log both the request parameters and the response data

## Displaying Streaming Service Providers

* Use the TMDB API to fetch watch providers for movies and TV shows
* Create a dedicated hook (useWatchProviders) to fetch and manage watch provider data
* Implement proper TypeScript interfaces for watch provider data structures
* Use the StreamingServiceIcon component to display provider logos consistently across the app
* Maintain a fallback map of provider IDs to logo paths in case the API doesn't provide them
* Limit the number of providers displayed in list views to avoid cluttering the UI
* Show a "+X more" indicator when there are more providers than can be displayed
* In detail views, show the provider name along with the logo for better identification
* Group providers by type (subscription, rental, purchase) when displaying them
* Use proper error handling and fallback UI when provider data is unavailable
* Consider the performance implications of fetching provider data for each item in a list
* Implement caching for provider data to reduce API calls
* Use proper styling to ensure provider logos are displayed consistently
* Add proper null checks when accessing nested provider data properties
* Remember to attribute JustWatch as the source of watch provider data as required by TMDB

## Color Handling and Transparency in React Native

* Always use proper color formats when applying transparency in React Native
* Do not concatenate strings with hex codes like `'#FFFFFF' + '30'` as this won't work for all color formats
* When applying transparency to colors in components like Chip, use rgba format: `'rgba(255, 255, 255, 0.3)'`
* For theme-aware transparency, create dedicated variables that adapt to the current theme:
  ```