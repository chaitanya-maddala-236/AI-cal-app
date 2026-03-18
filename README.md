# AI Calories Tracker

A React Native mobile application for intelligent nutrition and fitness tracking, powered by AI. The app helps users log meals, exercises, and water intake while providing AI-driven insights and an AI food scanner that automatically identifies dishes and calculates their macros from a photo.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the App](#running-the-app)
  - [Start the Metro Bundler](#step-1-start-the-metro-bundler)
  - [Run on Android](#step-2a-run-on-android)
  - [Run on iOS](#step-2b-run-on-ios)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Architecture Overview](#architecture-overview)
- [API Configuration](#api-configuration)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

---

## Features

### Core Tracking
- **Food / Meal Logging** – Add meals categorised by type (Breakfast, Lunch, Dinner, Snacks) with a full macro breakdown (calories, protein, carbs, fat).
- **Exercise Logging** – Record workouts with duration and estimated calories burned.
- **Water Intake** – Quickly log water consumption using preset amounts (250 ml, 500 ml, 750 ml, 1000 ml) or a custom value.

### AI-Powered Features
- **AI Food Scanner** – Take or upload a photo of your food; the app sends it to the backend AI service, which identifies the dish and returns an estimated calorie and macro breakdown automatically.
- **AI Insights** – Receive personalised nutrition suggestions and trend analysis based on your recent logs and stated fitness goal.

### Dashboard & Analytics
- Daily progress overview showing calories consumed vs. target, plus macro breakdown.
- Weekly analytics with day-by-day calorie trends and activity feed.
- Consistency streak tracking to keep you motivated.

### User & Onboarding
- Sign-up / Sign-in with JWT authentication stored securely via the device Keychain.
- Multi-step onboarding to capture personal details (age, gender, height, weight) and fitness goal (fat loss, muscle gain, or maintenance), from which a daily calorie target is calculated.
- Profile screen to update goals, personal info, calorie target, dark mode, and notification preferences.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Language | TypeScript 5.8 |
| Framework | React Native 0.84 |
| UI Library | React 19 |
| State Management | Zustand 5 |
| Navigation | React Navigation 7 (native stack + bottom tabs) |
| HTTP Client | Axios 1.13 (with automatic JWT refresh interceptor) |
| Secure Storage | react-native-keychain |
| Animations | react-native-reanimated |
| Icons | @react-native-vector-icons/material-design-icons |
| Testing | Jest 29 + React Test Renderer |
| Linting / Formatting | ESLint 8 + Prettier 2 |

---

## Prerequisites

Before you begin, make sure the following tools are installed on your machine:

- **Node.js** ≥ 22.11.0 (check with `node -v`)
- **npm** (comes with Node.js)
- **React Native CLI environment** – follow the official [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide for your OS and target platform.

**For Android:**
- Android Studio with an Android SDK and a configured emulator (or a physical device with USB debugging enabled).

**For iOS (macOS only):**
- Xcode (latest stable version recommended).
- Ruby + Bundler (`gem install bundler`).
- CocoaPods (installed via Bundler in the steps below).

---

## Installation

1. **Clone the repository**

   ```sh
   git clone https://github.com/chaitanya-maddala-236/AI-cal-app.git
   cd AI-cal-app
   ```

2. **Install JavaScript dependencies**

   ```sh
   npm install
   ```

3. **iOS only – install CocoaPods dependencies**

   Install the Ruby Bundler gems (only needed once per machine):
   ```sh
   bundle install
   ```

   Then install the iOS native pods (run again after any native dependency update):
   ```sh
   bundle exec pod install
   ```

---

## Running the App

### Step 1: Start the Metro Bundler

Metro is the JavaScript bundler for React Native. Start it in a dedicated terminal from the project root:

```sh
npm start
```

Keep this terminal open while you develop.

---

### Step 2a: Run on Android

With Metro running, open a **new terminal** and execute:

```sh
npm run android
```

This compiles the Android app and launches it in the Android Emulator or on a connected device.

---

### Step 2b: Run on iOS

With Metro running, open a **new terminal** and execute:

```sh
npm run ios
```

This compiles the iOS app and launches it in the iOS Simulator (default) or on a connected device.

> **Tip:** You can also open `ios/AICalApp.xcworkspace` in Xcode and run it from there for more control over the target device and build settings.

---

## Available Scripts

| Script | Description |
|---|---|
| `npm start` | Starts the Metro bundler dev server |
| `npm run android` | Builds and runs the app on Android |
| `npm run ios` | Builds and runs the app on iOS |
| `npm run lint` | Runs ESLint across the TypeScript source files |
| `npm test` | Runs the Jest test suite |

---

## Project Structure

```
AI-cal-app/
├── __tests__/               # Jest test files
├── android/                 # Android native project (Gradle)
├── ios/                     # iOS native project (Xcode / CocoaPods)
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── common/          # Button, Input, Card, CircularProgress, StateViews
│   │   ├── home/            # ActivityItemCard, MacroCard
│   │   └── navigation/      # FloatingActionButton
│   ├── constants/           # App-wide constants
│   │   ├── api.ts           # Base URL and endpoint paths
│   │   ├── colors.ts        # Design-system colour palette
│   │   ├── screens.ts       # Screen name constants for navigation
│   │   └── theme.ts         # Shared spacing / typography tokens
│   ├── navigation/          # React Navigation configuration
│   │   ├── RootNavigator.tsx
│   │   └── AppNavigator.tsx
│   ├── screens/             # Feature screens
│   │   ├── auth/            # SignInScreen, SignUpScreen
│   │   ├── home/            # HomeScreen, DailyDetailScreen, EditEntryScreen
│   │   ├── onboarding/      # OnboardingScreen (multi-step)
│   │   ├── profile/         # ProfileScreen
│   │   ├── analysis/        # AnalysisScreen
│   │   ├── insights/        # AIInsightsScreen
│   │   ├── scanner/         # AIScannerScreen
│   │   ├── meals/           # AddMealScreen
│   │   ├── exercise/        # AddExerciseScreen
│   │   └── water/           # AddWaterScreen
│   ├── services/            # API service layer
│   │   ├── apiClient.ts     # Axios instance with JWT interceptors
│   │   ├── authService.ts   # Login, register, logout, token refresh
│   │   ├── aiService.ts     # AI scan and insights endpoints
│   │   ├── logService.ts    # Food, exercise and water log endpoints
│   │   └── index.ts
│   ├── store/               # Zustand global state stores
│   │   ├── authStore.ts     # Auth state, onboarding, user profile
│   │   ├── dashboardStore.ts# Daily logs, food/exercise/water entries
│   │   └── index.ts
│   └── utils/               # Shared utilities and TypeScript types
│       ├── types.ts          # All TypeScript interfaces and enums
│       ├── helpers.ts        # General-purpose helper functions
│       └── index.ts
├── App.tsx                  # Application entry point
├── app.json                 # React Native app config (name, display name)
├── babel.config.js          # Babel transpiler config
├── jest.config.js           # Jest configuration
├── metro.config.js          # Metro bundler config
├── tsconfig.json            # TypeScript compiler options
└── package.json             # Node dependencies and scripts
```

---

## Architecture Overview

The app follows a layered architecture:

```
Screens  ──►  Zustand Stores  ──►  Service Layer  ──►  Axios HTTP Client  ──►  Backend API
   ▲                │                                                               │
   └────────────────┘  (state updates trigger re-renders)                           │
                                                                                    ▼
                                                                    https://api.aicaloriestracker.com/v1
```

- **Screens** read state from Zustand stores and dispatch actions.
- **Stores** (Zustand) hold global app state (auth, dashboard) and call service functions to fetch or mutate remote data.
- **Services** wrap Axios calls and map responses to typed models.
- **apiClient.ts** attaches the JWT `Authorization` header automatically and handles silent token refresh when a `401` response is received.
- JWT tokens are persisted securely using **react-native-keychain** (never in plain `AsyncStorage`).

---

## API Configuration

The base URL for all API calls is defined in `src/constants/api.ts`:

```ts
export const API_BASE_URL = 'https://api.aicaloriestracker.com/v1';
```

If you need to point the app at a different backend (e.g., a local development server), update this constant.

### Endpoint Summary

| Category | Method | Path |
|---|---|---|
| Auth | POST | `/auth/login` |
| Auth | POST | `/auth/register` |
| Auth | POST | `/auth/logout` |
| Auth | POST | `/auth/refresh` |
| User | GET | `/user/profile` |
| User | PUT | `/user/update` |
| User | POST | `/user/onboarding` |
| Dashboard | GET | `/dashboard/today` |
| Logs | GET | `/logs?date=<YYYY-MM-DD>` |
| Logs – Food | POST | `/logs/food` |
| Logs – Food | PUT | `/logs/{id}` |
| Logs – Food | DELETE | `/logs/{id}` |
| Logs – Exercise | POST | `/logs/exercise` |
| Logs – Water | POST | `/logs/water` |
| AI Scanner | POST | `/ai/scan` |
| AI Insights | GET | `/ai/insights` |
| Analytics | GET | `/analytics/weekly` |

---

## Testing

Run the full test suite with:

```sh
npm test
```

Tests live in the `__tests__/` directory. The test setup (`jest.setup.ts`) mocks all native modules (Keychain, Reanimated, SVG, Screens, Vector Icons) so Jest can run them in a Node.js environment without a simulator.

---

## Troubleshooting

| Problem | Solution |
|---|---|
| Metro fails to start | Delete the Metro cache: `npm start -- --reset-cache` |
| Android build fails | Ensure `ANDROID_HOME` is set and an emulator/device is available. Run `npx react-native doctor` for diagnostics. |
| iOS build fails | Run `bundle exec pod install` again inside the project root, then clean the Xcode build folder (`Product → Clean Build Folder`). |
| "Unable to resolve module" error | Stop Metro, run `npm install`, restart Metro with `--reset-cache`. |
| App crashes on launch | Check that all native dependencies have been linked correctly by re-running `bundle exec pod install` (iOS) or rebuilding the Gradle project (Android). |

For more general React Native troubleshooting, see the [official guide](https://reactnative.dev/docs/troubleshooting).
