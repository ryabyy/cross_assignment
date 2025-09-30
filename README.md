# Task Tracker (React Native)

An educational React Native app that demonstrates a modern task manager: create, organize, and track tasks across color‑coded groups with priorities, dates, tags, live search, and biometric protection.

This project was built as part of a React Native course. It uses common libraries for navigation, icons, state, persistence, and biometrics.

---

## Features

- **Task management**
  - Add new tasks from the home screen or a detailed form
  - Edit existing tasks; delete tasks with confirmation
  - Mark tasks done/undone
  - Set **priority**, **start** and **end** dates
  - Add **tags** (text field)
- **Grouping**
  - Organize tasks into named groups with a **color**
  - Quickly switch current group; add/edit groups
- **Quick add**
  - Long‑press the add button to quickly create a task from the input field
- **Live search**
  - Toggle a search bar from the header
  - Filters tasks in the current group and the selected status (All / In progress / Completed)
  - Matches against task title, description, and tags
- **Biometric lock (session)**
  - Uses fingerprint/Face ID to unlock the app session
  - Relocks when the app goes background/inactive; prompts again on return
  - Avoids showing task content before auth is resolved
- **Nice touches**
  - Smooth UI transitions with `LayoutAnimation`
  - Vector icons throughout the UI

---

## Tech stack

- **Navigation**: `@react-navigation/native`, stack/drawer navigators
- **State & persistence**: Redux Toolkit and `redux-persist`
- **Biometrics**: `react-native-biometrics`
- **Icons**: `react-native-vector-icons` (MaterialIcons, MaterialCommunityIcons)
- **UI**: React Native components, `LayoutAnimation`

---

## Project structure (high level)

- `App.tsx` — app root, providers, navigation container
- `src/navigation/` — stack and drawer navigators
- `src/screens/` — Home, Task details, Settings, About
- `src/components/` — reusable UI (Header, TaskList, TaskForm, TaskGroup, Security/UnlockGate)
- `src/context/` — contexts (`TaskGroupContext`, `AuthContext` for biometrics)
- `src/store/` — Redux store and slices
- `src/api/` — API client and types for cloud sync (request/response shapes, adapters, utilities)

---

## Getting started

Before running, complete the official React Native environment setup (Android/iOS) for your OS:
https://reactnative.dev/docs/set-up-your-environment

### 1) Start Metro
Use your preferred package manager to start the Metro bundler from the project root.

### 2) Run on a device/emulator
- Android: run with your usual RN script or from Android Studio
- iOS: install CocoaPods and run from Xcode or your usual RN script

If everything is set up correctly, the app launches in your emulator/simulator or on device. Hot reloading (Fast Refresh) is enabled.

---

## Biometrics notes (testing on emulator/simulator)

- The app queries sensor availability on launch and shows a lock screen if available.
- On Android Emulator:
  - Ensure the AVD supports fingerprint
  - Enroll a fingerprint inside the emulator OS (Settings → Security → Fingerprint)
  - When prompted by the app, use Emulator → Extended Controls → Fingerprint → "Touch Sensor"
- On iOS Simulator: ensure Face ID is available and enabled in features; configure Face ID enrollment for testing.

If no biometric sensor is available or nothing is enrolled, the app stays unlocked (bypass) to avoid blocking usage during development.

---

## Common actions

- **Add a task**: type into the input field and tap the + button, or open the detailed form
- **Quick add**: long‑press the + button to quickly create from the input
- **Switch status**: use the tabs (All / In progress / Completed)
- **Search**: tap the search icon in the header to reveal the search field; type to filter; tap the arrow to hide and clear
- **Groups**: select the current group, or add/edit groups (name + color)
- **Biometrics**: on app open or when returning from background, authenticate to view content

---

## Troubleshooting

- Ensure your environment is correctly set up for React Native (Android SDK/iOS toolchain)
- For Android biometrics, confirm fingerprints are enrolled inside the emulator OS
- Rebuild the app after adding/changing native dependencies
- If vector icons don’t render, confirm fonts are linked (Gradle task is already included)

---

## About

This repository demonstrates a small but complete React Native app focused on practical UI patterns, navigation, state management, persistence, animations, and biometric gating. It was created for educational purposes within a React Native course.
