# Local Android APK Build Guide

## Option 1: Expo Development Build (Local)

If you want to stick with Expo but build locally:

1. Install Android Studio and set up Android SDK
2. Install Expo CLI: `npm install -g @expo/cli`
3. Create development build: `npx expo run:android`

This creates a local development build that runs on your device/emulator.

## Option 2: Eject to React Native CLI (Full Local Control)

For complete local control without EAS dependency:

### Prerequisites
- Android Studio with Android SDK (API level 33+)
- Java Development Kit (JDK) 17
- Android device or emulator

### Steps

1. **Eject from Expo managed workflow:**
   ```bash
   cd mobile
   npx expo eject
   ```

2. **Install React Native CLI:**
   ```bash
   npm install -g @react-native-community/cli
   ```

3. **Configure Android environment variables:**
   ```bash
   export ANDROID_HOME=$HOME/Android/Sdk
   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/tools
   export PATH=$PATH:$ANDROID_HOME/tools/bin
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```

4. **Build APK locally:**
   ```bash
   cd android
   ./gradlew assembleDebug
   ```

5. **Find your APK:**
   Located at: `android/app/build/outputs/apk/debug/app-debug.apk`

### Production Build
For release APK:
```bash
cd android
./gradlew assembleRelease
```

## Option 3: React Native Without Expo

Create a pure React Native project from scratch:

1. **Initialize new React Native project:**
   ```bash
   npx react-native init TokTokenWallet
   ```

2. **Port the wallet logic** from our Expo version
3. **Use React Native AsyncStorage** instead of Expo SecureStore
4. **Replace Expo packages** with React Native equivalents

## Recommendation

For your use case, I recommend **Option 1** (Expo local build) because:
- Keeps the existing code intact
- No need to eject or rewrite components
- Still builds locally on your machine
- Simpler than full React Native CLI setup

Would you like me to update the build instructions to use local development builds instead of EAS?