# TokToken Wallet

A secure cryptocurrency wallet application for Ethereum on the Sepolia testnet. Available as both a web application and native Android mobile app.

## Features

- **Secure Wallet Creation**: Generate new wallets with 12-word recovery phrases
- **Wallet Recovery**: Restore existing wallets using mnemonic phrases
- **Balance Monitoring**: Real-time ETH balance checking on Sepolia testnet
- **Address Management**: Copy and share wallet addresses
- **Multi-Platform**: Web app and native Android mobile app

## Architecture

### Web Application
- **Frontend**: React with TypeScript, Vite build system
- **Backend**: Express.js with session management
- **UI**: Tailwind CSS with shadcn/ui components
- **State**: TanStack Query for server state management
- **Blockchain**: Ethers.js for Ethereum interactions
- **Database**: PostgreSQL with Drizzle ORM

### Mobile Application
- **Framework**: React Native with Expo
- **Navigation**: React Navigation Stack
- **State**: React Context with hooks
- **Storage**: Expo SecureStore for encrypted key storage
- **Build**: EAS (Expo Application Services)

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (for web app)
- Android Studio with SDK (for mobile builds)

### Web Application

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   DATABASE_URL=your_postgresql_connection_string
   SESSION_SECRET=your_session_secret
   ALCHEMY_API_KEY=your_alchemy_api_key
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Access the app**: Open http://localhost:5000

### Mobile Application (Android APK)

1. **Navigate to mobile directory**:
   ```bash
   cd mobile
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Install Expo CLI globally**:
   ```bash
   npm install -g @expo/cli eas-cli
   ```

4. **Login to Expo**:
   ```bash
   eas login
   ```

5. **Configure build**:
   ```bash
   eas build:configure
   ```

6. **Build Android APK**:
   ```bash
   eas build --platform android --profile preview
   ```

7. **Download APK**: The APK will be available in your Expo dashboard after build completion

### Local Mobile Development

For local development and testing:

```bash
cd mobile
npm start
```

Then use the Expo Go app on your Android device to scan the QR code.

## Deployment

### Web Application
- **Platform**: Replit autoscale deployment
- **Build**: `npm run build`
- **Start**: `node dist/index.js`

### Mobile Application
- **Platform**: Expo Application Services (EAS)
- **Distribution**: APK download from Expo dashboard
- **Requirements**: Expo account for cloud builds

## Security Features

- **Encrypted Storage**: Recovery phrases stored securely using device encryption
- **Local Key Management**: Private keys never transmitted over network
- **Session Security**: Secure session management for web app
- **Testnet Only**: Safe testing environment on Sepolia network

## Network Configuration

- **Blockchain**: Ethereum Sepolia Testnet
- **Providers**: Alchemy (primary), Infura (fallback)
- **Faucets**: Use Sepolia faucets for test ETH

## Project Structure

```
├── client/          # Web frontend (React)
├── server/          # Backend API (Express)
├── shared/          # Shared schemas and types
├── mobile/          # React Native mobile app
└── wallet-db/       # Database files
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly on both web and mobile
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Web app: Check browser console for errors
- Mobile app: Use Expo development tools
- General: Review error logs and documentation