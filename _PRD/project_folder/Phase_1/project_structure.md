# Project Structure - Ne İzlesem?

This document outlines the current structure of the Ne İzlesem? project, a cross-platform application built with Expo and React Native.

## Root Directory

```
ne-izlesem/
├── _PRD/                      # Project documentation and requirements
├── app/                       # Expo Router app directory
├── assets/                    # Static assets like images and fonts
├── components/                # Reusable UI components
├── constants/                 # Application constants
├── context/                   # React context providers
├── hooks/                     # Custom React hooks
├── localization/              # i18n localization files
├── screens/                   # Screen components (may be deprecated in favor of app/ directory)
├── services/                  # API and other services
├── types/                     # TypeScript type definitions
├── utils/                     # Utility functions
├── App.tsx                    # Main App component
├── app.json                   # Expo configuration
├── index.ts                   # Entry point
├── package.json               # Project dependencies
└── tsconfig.json              # TypeScript configuration
```

## App Directory (Expo Router)

```
app/
├── _layout.tsx                # Root layout with providers and navigation configuration
├── index.tsx                  # Home screen with modern card-based UI and improved touch targets
├── recommendations.tsx        # Recommendations screen with filtering and sorting options
├── search.tsx                 # Search screen
├── settings.tsx               # Settings screen with dark mode toggle and year range slider
├── streaming-services.tsx     # Screen for selecting streaming services
└── details/                   # Details screen directory
    └── [id].tsx               # Dynamic route for media details
```

## Components Directory

```
components/
├── ErrorMessage.tsx           # Error message display component
├── Loader.tsx                 # Loading indicator component
├── MediaCard.tsx              # Responsive card for displaying movie/TV show items with dark theme support
├── RatingStars.tsx            # Visual rating display component
└── StreamingServiceIcon.tsx   # Component for displaying streaming service logos
```

## Context Directory

```
context/
├── ThemeContext.tsx           # Context provider for theme management (light/dark/system)
```

## Services Directory

```
services/
├── tmdbService.ts           # Service for interacting with TMDB API, includes functions for fetching movies, TV shows, genres, and watch providers
```

## Hooks Directory

```
hooks/
├── useGenres.ts             # Hook for fetching and caching genre data
├── usePreferences.ts        # Hook for managing user preferences (streaming services, year range, theme)
├── useRecommendations.ts    # Hook for fetching and filtering recommendations with improved cache invalidation
└── useWatchProviders.ts     # Hook for fetching watch providers for specific media items
```

## Localization Directory

```
localization/
├── i18n.ts                  # i18n configuration
├── en.json                  # English translations
└── tr.json                  # Turkish translations
```

## Types Directory

```
types/
├── index.ts                 # Common type definitions
├── tmdb.ts                  # TMDB API response type definitions
└── preferences.ts           # User preferences type definitions
```

## Constants Directory

```
constants/
├── colors.ts                # Color constants
├── layout.ts                # Layout constants
└── tmdb.ts                  # TMDB API constants
```