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
├── index.tsx                  # Home screen with modern card-based UI
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
├── MediaCard.tsx              # Card component for displaying movie/TV show items with real genre data from the API
├── RatingStars.tsx            # Visual rating display component
└── StreamingServiceIcon.tsx   # Component for displaying streaming service logos
```