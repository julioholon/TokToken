# TokToken Wallet Mobile

React Native mobile application for TokToken Wallet - a secure Ethereum wallet for Sepolia testnet.

## Features
- Secure wallet creation with 12-word recovery phrase
- Wallet recovery from mnemonic
- Balance checking on Sepolia testnet
- Address management with copy functionality
- Secure local storage using Expo SecureStore

## Build Instructions

### Prerequisites
- Node.js 18+
- Android Studio with Android SDK
- Java Development Kit (JDK) 17+

### Setup
1. Navigate to mobile directory: `cd mobile`
2. Install dependencies: `npm install`
3. Install EAS CLI globally: `npm install -g @expo/cli eas-cli`

### Development
- Start development server: `npm start`
- Run on Android: `npm run android`

### Building APK
1. Login to Expo: `eas login`
2. Configure project: `eas build:configure`
3. Build APK: `eas build --platform android --profile preview`

The APK will be available for download from the Expo dashboard after build completion.

## Architecture
- **Framework**: React Native with Expo
- **Navigation**: React Navigation Stack
- **State Management**: React Context + Hooks
- **Blockchain**: Ethers.js for Ethereum interactions
- **Storage**: Expo SecureStore for encrypted key storage
- **Network**: Sepolia testnet via Alchemy

## Security Features
- Recovery phrases encrypted using device secure storage
- No private keys transmitted over network
- Local key generation and management
- Secure clipboard operations