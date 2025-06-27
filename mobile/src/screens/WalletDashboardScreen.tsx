import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useNavigation } from '@react-navigation/native';
import { useWallet } from '../contexts/WalletContext';

const WalletDashboardScreen = () => {
  const navigation = useNavigation();
  const { wallet, removeWallet, getBalance } = useWallet();
  const [balance, setBalance] = useState<string>('0.000');
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (wallet) {
      loadBalance();
    }
  }, [wallet]);

  const loadBalance = async () => {
    if (!wallet) return;
    
    try {
      setIsLoadingBalance(true);
      const walletBalance = await getBalance();
      setBalance(walletBalance);
    } catch (error) {
      console.error('Error loading balance:', error);
      setBalance('0.000');
    } finally {
      setIsLoadingBalance(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadBalance();
    setIsRefreshing(false);
  };

  const handleCopyAddress = async () => {
    if (!wallet?.walletAddress) return;
    
    try {
      await Clipboard.setStringAsync(wallet.walletAddress);
      Alert.alert('Success', 'Wallet address copied to clipboard!');
    } catch (error) {
      Alert.alert('Error', 'Failed to copy to clipboard');
    }
  };

  const handleRemoveWallet = () => {
    Alert.alert(
      'Remove Wallet',
      'Are you sure you want to remove this wallet? You\'ll need your 12-word recovery phrase to access it again.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeWallet();
              navigation.navigate('Home' as never);
            } catch (error) {
              Alert.alert('Error', 'Failed to remove wallet');
            }
          }
        }
      ]
    );
  };

  const formatAddress = (address: string) => {
    return `${address.substring(0, 5)}...${address.substring(address.length - 5)}`;
  };

  if (!wallet) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No wallet found</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Home' as never)}
        >
          <Text style={styles.buttonText}>Go Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
      }
    >
      <View style={styles.content}>
        {/* Wallet Header */}
        <View style={styles.header}>
          <Text style={styles.walletName}>{wallet.walletName}</Text>
          <Text style={styles.networkBadge}>Sepolia Testnet</Text>
        </View>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <View style={styles.balanceRow}>
            <Text style={styles.balanceAmount}>
              {isLoadingBalance ? '...' : balance}
            </Text>
            <Text style={styles.balanceCurrency}>ETH</Text>
          </View>
          {isLoadingBalance && (
            <View style={styles.loadingIndicator}>
              <ActivityIndicator size="small" color="#ffffff" />
            </View>
          )}
        </View>

        {/* Address Card */}
        <View style={styles.addressCard}>
          <Text style={styles.cardTitle}>Wallet Address</Text>
          <TouchableOpacity
            style={styles.addressContainer}
            onPress={handleCopyAddress}
          >
            <Text style={styles.address}>{formatAddress(wallet.walletAddress)}</Text>
            <Text style={styles.copyIcon}>📋</Text>
          </TouchableOpacity>
        </View>

        {/* Actions Card */}
        <View style={styles.actionsCard}>
          <Text style={styles.cardTitle}>Actions</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>⬇️</Text>
              <Text style={styles.actionText}>Receive</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleRefresh}>
              <Text style={styles.actionIcon}>🔄</Text>
              <Text style={styles.actionText}>Refresh</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Danger Zone */}
        <View style={styles.dangerCard}>
          <Text style={styles.dangerTitle}>Danger Zone</Text>
          <TouchableOpacity
            style={styles.dangerButton}
            onPress={handleRemoveWallet}
          >
            <Text style={styles.dangerButtonText}>🗑️ Remove Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    padding: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#6B7280',
    marginBottom: 20,
  },
  header: {
    marginBottom: 24,
  },
  walletName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  networkBadge: {
    fontSize: 14,
    color: '#6B7280',
  },
  balanceCard: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
    position: 'relative',
  },
  balanceLabel: {
    fontSize: 14,
    color: '#DBEAFE',
    marginBottom: 8,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginRight: 8,
  },
  balanceCurrency: {
    fontSize: 16,
    color: '#DBEAFE',
  },
  loadingIndicator: {
    position: 'absolute',
    bottom: 16,
    left: 24,
  },
  addressCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
  },
  address: {
    fontSize: 14,
    fontFamily: 'monospace',
    color: '#111827',
    flex: 1,
  },
  copyIcon: {
    fontSize: 16,
    marginLeft: 8,
  },
  actionsCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  actionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    color: '#374151',
  },
  dangerCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
  },
  dangerTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#DC2626',
    marginBottom: 16,
  },
  dangerButton: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  dangerButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#DC2626',
  },
  button: {
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default WalletDashboardScreen;