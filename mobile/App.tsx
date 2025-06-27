import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';

import HomeScreen from './src/screens/HomeScreen';
import SetupWalletScreen from './src/screens/SetupWalletScreen';
import RecoveryPhraseScreen from './src/screens/RecoveryPhraseScreen';
import WalletDashboardScreen from './src/screens/WalletDashboardScreen';

import { WalletProvider } from './src/contexts/WalletContext';

const Stack = createStackNavigator();
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerStyle: {
                backgroundColor: '#3B82F6',
              },
              headerTintColor: '#FFFFFF',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          >
            <Stack.Screen 
              name="Home" 
              component={HomeScreen}
              options={{ title: 'TokToken Wallet' }}
            />
            <Stack.Screen 
              name="SetupWallet" 
              component={SetupWalletScreen}
              options={{ title: 'Setup Wallet' }}
            />
            <Stack.Screen 
              name="RecoveryPhrase" 
              component={RecoveryPhraseScreen}
              options={{ title: 'Recovery Phrase' }}
            />
            <Stack.Screen 
              name="WalletDashboard" 
              component={WalletDashboardScreen}
              options={{ title: 'Wallet Dashboard' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </WalletProvider>
    </QueryClientProvider>
  );
}