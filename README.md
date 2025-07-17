
# 📞 React Native Android Phone Number Hint

[![npm version](https://img.shields.io/npm/v/react-native-android-phone-number-hint.svg)](https://www.npmjs.com/package/@shayrn/react-native-android-phone-number-hint)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A simple and lightweight React Native package that allows Android users to **select their SIM-based phone number** using the native **Google Phone Number Hint Picker**. This improves user experience by avoiding manual number entry.

---

## 🧩 What is Phone Number Hint API?

The **Phone Number Hint API** (part of Google Identity Services) allows apps to request the user’s phone number using a secure, native picker. It returns the number linked to the device SIM without requiring any permissions. This is useful for onboarding, OTP flows, and autofill use cases.

---

## ✨ Features

- ✅ Fetch SIM-based phone number using Android’s native dialog
- 🚫 No runtime permissions required
- ⚡ Fast & lightweight (uses Play Services)
- 📦 Built with TurboModules
- 📱 Supports Android (API 24+)

---

## 🚀 Getting Started

### 📦 Install the package

```bash
npm install react-native-android-phone-number-hint
# or
yarn add react-native-android-phone-number-hint
````

---

### ⚙️ Android Setup (Manual Linking)

#### 1. Add Play Services Auth dependency 

In `android/app/build.gradle`:

```gradle
dependencies {
  implementation 'com.google.android.gms:play-services-auth:21.3.0'
}
```

In `android/app/src/main/java/androidphonenumberhint/example/MainApplication.kt`:

```kt
import com.androidphonenumberhint.AndroidPhoneNumberHintPackage // NOTE: Add this line
...

override fun getPackages(): List<ReactPackage> {
    return PackageList(this).packages.apply {
        // Manually add packages that can't be auto-linked
        add(AndroidPhoneNumberHintPackage()) // NOTE: add this line
    }
}

override fun getJSMainModuleName(): String = "index"

override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED

override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED
```

#### 2. Ensure `minSdkVersion` is 24 or higher

In `android/build.gradle` or your root `gradle.properties`:

```properties
minSdkVersion=24
targetSdkVersion=34
compileSdkVersion=35
```

#### 3. For Turborepo/Monorepo

In your app’s `settings.gradle`:

```gradle
include(":react-native-android-phone-number-hint")
project(":react-native-android-phone-number-hint").projectDir = new File(rootDir, "../../packages/react-native-android-phone-number-hint/android")
```

And ensure `pluginManagement` includes:

```gradle
pluginManagement {
  includeBuild("../../node_modules/react-native-gradle-plugin")
}
```

---

## 🛠️ Usage Example

```tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { showPhoneNumberHint } from 'react-native-android-phone-number-hint';

export default function App() {
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    const init = async () => {
      try {
        const _phoneNumber = await showPhoneNumberHint();
        setPhoneNumber(_phoneNumber);
      } catch (err) {
        console.log('🚀 ~ init ~ err:', err);
      }
    };
    init();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Result: {phoneNumber || "Oops! can't find SIM Number"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { color: 'black', fontSize: 18 },
});
```

---

## 📷 Demo Example

> ![Demo](./demo.gif)

---

## ✅ Compatibility

| Platform | Support               |
| -------- | --------------------- |
| Android  | ✅ Supported (API 24+) |
| iOS      | ❌ Not supported       |

> 📱 Works only on physical Android devices with SIM and Google Play Services installed.

---

## 🧠 Notes

* Uses [Google Identity Services](https://developers.google.com/identity) under the hood
* Requires no special permissions (like `READ_PHONE_STATE`)
* Phone number may return `null` if the user cancels or SIM not found

---

## 📄 License

MIT © 2025 \[Your Name or Org]

---

## 🙌 Contributing

Got suggestions or bug fixes? PRs and issues are welcome!
👉 [GitHub Issues](https://github.com/your-username/react-native-android-phone-number-hint/issues)

---

## 💬 Questions?

Join the conversation:
👉 [GitHub Discussions](https://github.com/your-username/react-native-android-phone-number-hint/discussions)


