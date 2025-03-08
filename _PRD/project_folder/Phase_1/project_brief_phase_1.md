# Project Brief: Ne İzlesem? - Phase 1 (MVP)

**Project Goal:** Develop the core recommendation engine for "Ne İzlesem?", allowing users to select their streaming services and receive relevant movie/TV show recommendations from TMDB.

**Features:**

*   **Streaming Service Selection:**
    *   Users can select their subscribed streaming services from a list.
    *   Selections are stored locally (using `AsyncStorage` for this MVP).
*   **TMDB Recommendations:**
    *   Fetch movie/TV show data from TMDB.
    *   Filter recommendations based on the user's selected streaming services (using TMDB's `with_watch_providers` filter).
    *   Display recommendations with:
        *   Poster Image
        *   Title (Turkish and/or original)
        *   Synopsis (Turkish)
        *   Genres
        *   Ratings (IMDb, etc.)
        *   Streaming service availability icons
*   **Movie/TV Show Details Screen:**
    *   Display detailed information for a selected item.
    *   Include full synopsis, cast/crew, and potentially trailers (if available via TMDB).
*   **Basic Search:**
    *   Allow users to search for movies/TV shows by title.
    *   Display search results with streaming availability.
* **Filtering:**
    * Allow users to filter by genre.

**Key Entities (Data Structures):**

*   `MediaItem`: Represents a movie or TV show (data from TMDB).
    *   `id`: TMDB ID
    *   `title`: Title (Turkish)
    *   `original_title`: Original title
    *   `overview`: Synopsis (Turkish)
    *   `poster_path`: Path to poster image
    *   `genre_ids`: Array of genre IDs
    *   `vote_average`: Average rating
    *   `release_date`: Release date
    *   `...` (other relevant TMDB fields)
*   `StreamingService`: Represents a streaming service.
    *   `id`: TMDB provider ID
    *   `name`: Service name (e.g., "Netflix")
    *   `logo_path`: Path to service logo
*   `UserPreferences`: Stores user's selected streaming services (locally).
    *   `selectedServiceIds`: Array of selected `StreamingService` IDs.

**Business Rules:**

*   **Availability Filtering:** Only show recommendations available on the user's selected streaming services.
*   **API Rate Limiting:** Handle TMDB API rate limits gracefully, preventing errors.
*   **Error Handling:** Display informative error messages to the user (in Turkish).
*   **Language:** Prioritize Turkish language content and data from TMDB when available.

**Success Metrics:**

*   **Functionality:**  Successful fetching and display of recommendations, accurate filtering.
*   **Performance:** Fast loading times, smooth UI interactions.
*   **Usability:**  Easy-to-use interface, clear navigation.
*   **Reliability:**  Low error rates, robust handling of API issues.
*   **User Feedback:** Positive qualitative feedback from initial users.