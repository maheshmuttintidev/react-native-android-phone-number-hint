# React Native Android Phone Number Hint

[![npm version](https://img.shields.io/npm/v/%40shayrn%2Freact-native-android-phone-number-hint.svg)](https://www.npmjs.com/package/@shayrn/react-native-android-phone-number-hint)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A React Native library that provides access to Android's Phone Number Hint API, allowing users to select their SIM-based phone number through a native picker dialog. This eliminates manual phone number entry and improves user experience during onboarding and authentication flows.

## Overview

The Phone Number Hint API is part of Google Identity Services and provides a secure way to request phone numbers from the device without requiring runtime permissions. The API retrieves phone numbers associated with SIM cards, making it ideal for:

- User registration and onboarding
- OTP/SMS verification flows
- Phone number autofill scenarios
- Account recovery processes

## Features

- Native Android phone number picker integration
- No runtime permissions required
- Built with React Native TurboModules for optimal performance
- Comprehensive error handling with typed error codes
- Optional guidance dialog for user assistance
- TypeScript support with full type definitions
- Supports Android API 24+

## Installation

Install the package using your preferred package manager:

```bash
npm install @shayrn/react-native-android-phone-number-hint
```

```bash
yarn add @shayrn/react-native-android-phone-number-hint
```

```bash
npx expo install @shayrn/react-native-android-phone-number-hint
```

**Note:** This package requires native code and will not work with Expo Go. You must use:

- A custom development build (Expo EAS)
- A bare React Native project

## Configuration

### Android Setup

#### 1. Add Google Play Services Dependency

Add the following to your `android/app/build.gradle`:

```gradle
dependencies {
  implementation 'com.google.android.gms:play-services-auth:21.3.0'
}
```

#### 2. Register the Package (if needed)

For apps using manual linking, add the package to `MainApplication.kt`:

```kotlin
import com.androidphonenumberhint.AndroidPhoneNumberHintPackage

override fun getPackages(): List<ReactPackage> {
    return PackageList(this).packages.apply {
        add(AndroidPhoneNumberHintPackage())
    }
}
```

#### 3. Set Minimum SDK Version

Ensure your app targets Android API 24 or higher in `android/build.gradle`:

```properties
minSdkVersion=24
targetSdkVersion=34
compileSdkVersion=35
```

### Monorepo Configuration

For Turborepo or Yarn workspaces, update `settings.gradle`:

```gradle
include(":react-native-android-phone-number-hint")
project(":react-native-android-phone-number-hint").projectDir = new File(rootDir, "../../packages/react-native-android-phone-number-hint/android")

pluginManagement {
  includeBuild("../../node_modules/react-native-gradle-plugin")
}
```

## Usage

### Basic Example

```tsx
import { showPhoneNumberHint } from '@shayrn/react-native-android-phone-number-hint';

async function getPhoneNumber() {
  try {
    const phoneNumber = await showPhoneNumberHint();
    console.log('Selected phone number:', phoneNumber);
    return phoneNumber;
  } catch (error) {
    console.error('Failed to get phone number:', error);
  }
}
```

### Error Handling

The library provides typed error codes for precise error handling:

```tsx
import {
  showPhoneNumberHint,
  PhoneNumberHintErrorCodes,
} from '@shayrn/react-native-android-phone-number-hint';

async function handlePhoneNumberSelection() {
  try {
    const phoneNumber = await showPhoneNumberHint();
    // Process the phone number
    return phoneNumber;
  } catch (error: any) {
    switch (error.code) {
      case PhoneNumberHintErrorCodes.USER_CANCELLED:
        // User dismissed the picker - no action needed
        break;

      case PhoneNumberHintErrorCodes.RESOLUTION_REQUIRED:
      case PhoneNumberHintErrorCodes.API_NOT_CONNECTED:
        // Phone number hints disabled in device settings
        showEnableHintsDialog();
        break;

      case PhoneNumberHintErrorCodes.NETWORK_ERROR:
        showNetworkErrorMessage();
        break;

      default:
        console.error('Unexpected error:', error.message);
    }
  }
}
```

### Using the Guidance Dialog

You can optionally enable a built-in guidance dialog that helps users enable phone number hints:

```tsx
const phoneNumber = await showPhoneNumberHint({
  showGuidanceDialog: true,
});
```

When `showGuidanceDialog` is enabled, the library will automatically display a native dialog with instructions to enable phone number sharing if the feature is disabled. The promise will still reject with the appropriate error code.

## API Reference

### `showPhoneNumberHint(options?)`

Displays the native Android phone number hint picker and returns the selected phone number.

**Parameters:**

| Parameter            | Type      | Default | Description                                                                   |
| -------------------- | --------- | ------- | ----------------------------------------------------------------------------- |
| `showGuidanceDialog` | `boolean` | `false` | Display a guidance dialog when phone number hints are unavailable or disabled |

**Returns:** `Promise<string>` - Resolves with the selected phone number

**Throws:** Error with one of the following codes:

| Error Code            | Description                                                |
| --------------------- | ---------------------------------------------------------- |
| `USER_CANCELLED`      | User dismissed the picker without selecting a number       |
| `RESOLUTION_REQUIRED` | Phone number hints are disabled in device settings         |
| `API_NOT_CONNECTED`   | Google Play Services is not connected or unavailable       |
| `NETWORK_ERROR`       | Network connectivity issue prevented the operation         |
| `SIGN_IN_REQUIRED`    | User must sign in to their Google account                  |
| `DEVELOPER_ERROR`     | API configuration error (check your setup)                 |
| `NO_ACTIVITY`         | No active Android activity available                       |
| `ALREADY_IN_PROGRESS` | Another phone number hint request is already in progress   |
| `INTENT_ERROR`        | Failed to launch the phone number picker                   |
| `GET_PHONE_ERROR`     | Failed to retrieve the phone number from the picker result |
| `UNKNOWN_ERROR`       | An unexpected error occurred                               |

### Exported Constants

```tsx
PhoneNumberHintErrorCodes: {
  USER_CANCELLED: 'USER_CANCELLED',
  RESOLUTION_REQUIRED: 'RESOLUTION_REQUIRED',
  API_NOT_CONNECTED: 'API_NOT_CONNECTED',
  NETWORK_ERROR: 'NETWORK_ERROR',
  SIGN_IN_REQUIRED: 'SIGN_IN_REQUIRED',
  DEVELOPER_ERROR: 'DEVELOPER_ERROR',
  NO_ACTIVITY: 'NO_ACTIVITY',
  ALREADY_IN_PROGRESS: 'ALREADY_IN_PROGRESS',
  INTENT_ERROR: 'INTENT_ERROR',
  GET_PHONE_ERROR: 'GET_PHONE_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
}
```

## Troubleshooting

### Enabling Phone Number Hints on Android

If users encounter `RESOLUTION_REQUIRED` or `API_NOT_CONNECTED` errors, phone number sharing may be disabled on their device. Guide them to enable it:

1. Open **Settings** on the Android device
2. Navigate to **Google** settings
3. Select **All services** or search for **Phone number sharing**
4. Enable the **Phone number sharing** toggle

Alternative paths:

- Settings → System → Languages & input → Advanced → Autofill service → Google
- Settings → Google → Autofill

### Common Issues

**Error: RESOLUTION_REQUIRED**

- Phone number sharing is disabled in device settings
- Use the guidance dialog option or implement custom UI to direct users to settings

**Error: API_NOT_CONNECTED**

- Google Play Services is not installed or needs updating
- Ensure the app is running on a physical device with Google Play Services

**Error: NO_ACTIVITY**

- Called when there's no active React Native activity
- Ensure the function is called after the app has fully mounted

**No phone numbers shown in picker**

- Device may not have a SIM card inserted
- No phone numbers saved in the user's Google account
- Confirm the device has an active Google account signed in

## Platform Support

| Platform | Supported | Minimum Version |
| -------- | --------- | --------------- |
| Android  | Yes       | API 24 (7.0)    |
| iOS      | No        | N/A             |

**Requirements:**

- Physical Android device with SIM card
- Google Play Services installed
- Active Google account (phone number saved in account recommended)

## Technical Details

This library uses the [Google Identity Services Phone Number Hint API](https://developers.google.com/identity) to provide secure access to device phone numbers without requiring runtime permissions like `READ_PHONE_STATE`. The implementation uses React Native TurboModules for optimal performance and type safety.

## License

MIT © 2025 Mahesh Muttinti

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

- Report bugs or request features: [GitHub Issues](https://github.com/maheshmuttintidev/react-native-android-phone-number-hint/issues)
- Discuss improvements: [GitHub Discussions](https://github.com/maheshmuttintidev/react-native-android-phone-number-hint/discussions)

## Support

If you find this library useful, please consider:

- Starring the repository on GitHub
- Reporting issues you encounter
- Contributing improvements or bug fixes
- Sharing it with other developers
