# Product Brief: Ne İzlesem?

**Vision:** To be the go-to app for Turkish-speaking users to discover movies and TV shows tailored to their streaming service subscriptions and preferences, making finding something to watch effortless and enjoyable.

**Target User:** Turkish speakers who subscribe to one or more streaming services (Netflix, Amazon Prime Video, Disney+, BluTV, etc.).

**Features:**

*   **Phase 1 (MVP - Minimum Viable Product):**
    *   **Streaming Service Selection:** Users select their subscribed streaming services.
    *   **TMDB-Powered Recommendations:**  The app provides recommendations based on the selected services.
    *   **Filtering (Basic):** Filter recommendations by genre.
    *   **Movie/TV Show Details:**  View detailed information about a recommended item.
    *   **Search:** Basic search functionality by title (Turkish and original).

*   **Phase 2:**
    *   **User Accounts:** Implement user accounts using Supabase.
    *   **Watchlist:** Allow users to save movies/shows to a watchlist (stored in Supabase).
    *   **Advanced Filtering:** Add more filtering options (release year, rating source).

*   **Phase 3:**
    *   **Personalized Recommendations:** Develop a simple recommendation algorithm based on user watch history and/or ratings.
    *   **User Reviews/Ratings:**  Allow users to rate and review content.

**Overall Architecture:**

*   **Frontend:** Expo (React Native) with Expo Router.
*   **Backend (Data Source):** TMDB API for movie/TV show data and streaming availability.
*   **Backend (User Data):** Supabase for user accounts, watchlists, and preferences.
*   **Localization:** `i18n-js` and `expo-localization` for Turkish language support.

**Key Considerations:**

*   **TMDB API Usage:**  Adhere to API rate limits and terms of service.
*   **Data Freshness:** Implement mechanisms to keep streaming availability data up-to-date.
*   **User Experience:**  Prioritize a clean, intuitive, and fast user interface.