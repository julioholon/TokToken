# TokToken Wallet - Replit Configuration

## Overview

TokToken Wallet is a full-stack cryptocurrency wallet application built with React frontend and Express backend. The application allows users to create and manage Ethereum wallets on the Sepolia testnet, providing functionality for wallet creation, recovery, and balance monitoring.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Components**: Radix UI components with shadcn/ui styling
- **Styling**: Tailwind CSS with custom theme configuration
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js 20
- **Session Management**: Express session middleware
- **Database ORM**: Drizzle ORM
- **Database**: PostgreSQL (configured for Neon serverless)
- **Blockchain Integration**: Ethers.js for Ethereum interactions
- **Development**: tsx for TypeScript execution

## Key Components

### Database Schema (shared/schema.ts)
- **Users Table**: Stores user credentials, wallet names, addresses, and encrypted mnemonics
- **Validation Schemas**: Zod schemas for API request/response validation
- **Type Definitions**: TypeScript types derived from database schema

### Storage Layer (server/storage.ts)
- **Interface**: IStorage interface defining storage operations
- **Implementation**: LevelDB-based storage for persistent wallet data
- **Operations**: User creation, retrieval by ID/username/wallet address

### API Routes (server/routes.ts)
- **Wallet Setup**: POST endpoint for creating new wallets
- **Wallet Recovery**: POST endpoint for restoring wallets from mnemonic
- **Wallet Info**: GET endpoint for retrieving wallet details and balance
- **Recovery Phrase**: GET endpoint for accessing stored mnemonic

### Frontend Pages
- **HomePage**: Landing page with wallet detection and creation flow
- **SetupWalletPage**: Wallet creation and recovery interface with tabbed layout
- **RecoveryPhrasePage**: Secure display of wallet mnemonic phrase
- **WalletDashboardPage**: Main wallet interface showing balance and management options

## Data Flow

1. **Wallet Creation Flow**:
   - User enters wallet name on setup page
   - Backend generates 12-word mnemonic and derives wallet address
   - Encrypted mnemonic and wallet data stored in database
   - User redirected to recovery phrase display
   - Final redirect to wallet dashboard

2. **Wallet Recovery Flow**:
   - User enters wallet name and 12-word mnemonic
   - Backend validates mnemonic and derives wallet address
   - Wallet data stored and user redirected to dashboard

3. **Session Management**:
   - Express sessions store wallet address and mnemonic temporarily
   - Session data used for wallet info retrieval and authentication

4. **Balance Retrieval**:
   - Frontend queries wallet info endpoint
   - Backend uses Ethers.js to fetch balance from Sepolia testnet
   - Real-time balance updates with 30-second polling

## External Dependencies

### Blockchain Integration
- **Network**: Ethereum Sepolia testnet
- **Providers**: Alchemy (primary) and Infura (fallback) for blockchain connectivity
- **Libraries**: Ethers.js v6 for wallet operations and balance queries

### Database
- **Primary**: PostgreSQL via Neon serverless connection
- **Local**: LevelDB for development and local storage
- **Migrations**: Drizzle Kit for schema management

### UI Libraries
- **Component Library**: Radix UI primitives
- **Styling**: Tailwind CSS with custom theme
- **Icons**: Material Icons and Lucide React
- **Fonts**: Inter font family

## Deployment Strategy

### Development
- **Command**: `npm run dev`
- **Port**: 5000 (frontend and API)
- **Hot Reload**: Vite HMR for frontend, tsx watch for backend

### Production Build
- **Frontend**: Vite build to `dist/public`
- **Backend**: esbuild bundle to `dist/index.js`
- **Command**: `npm run build`

### Deployment Target
- **Platform**: Replit autoscale deployment
- **Environment**: NODE_ENV=production
- **Start Command**: `node dist/index.js`

### Environment Variables Required
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Session encryption key
- `ALCHEMY_API_KEY`: Alchemy provider key (optional)
- `INFURA_API_KEY`: Infura provider key (fallback)

## Mobile Build Instructions

The project now includes a complete React Native mobile application for Android APK generation.

### Mobile App Build Process
1. Navigate to mobile directory: `cd mobile`
2. Install dependencies: `npm install`
3. Install Expo CLI: `npm install -g @expo/cli eas-cli`
4. Login to Expo: `eas login`
5. Configure build: `eas build:configure`
6. Build APK: `eas build --platform android --profile preview`

### Mobile App Features
- Native Android application using React Native and Expo
- All core wallet functionality (creation, recovery, balance checking)
- Secure storage using Expo SecureStore
- Mobile-optimized UI with React Navigation
- EAS (Expo Application Services) cloud build system

## Changelog

```
Changelog:
- June 27, 2025. Added complete React Native mobile app with Android APK build support
- June 26, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```