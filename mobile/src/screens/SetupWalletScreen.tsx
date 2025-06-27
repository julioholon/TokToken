import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useWallet } from '../contexts/WalletContext';

const SetupWalletScreen = () => {
  const navigation = useNavigation();
  const { createWallet, restoreWallet, isLoading } = useWallet();
  const [activeTab, setActiveTab] = useState<'create' | 'restore'>('create');
  const [walletName, setWalletName] = useState('');
  const [mnemonic, setMnemonic] = useState('');

  const handleCreateWallet = async () => {
    if (!walletName.trim()) {
      Alert.alert('Error', 'Please enter a wallet name');
      return;
    }

    try {
      await createWallet(walletName.trim());
      navigation.navigate('RecoveryPhrase' as never);
    } catch (error) {
      Alert.alert('Error', 'Failed to create wallet. Please try again.');
    }
  };

  const handleRestoreWallet = async () => {
    if (!walletName.trim()) {
      Alert.alert('Error', 'Please enter a wallet name');
      return;
    }

    if (!mnemonic.trim()) {
      Alert.alert('Error', 'Please enter your recovery phrase');
      return;
    }

    const words = mnemonic.trim().split(/\s+/);
    if (words.length !== 12) {
      Alert.alert('Error', 'Recovery phrase must be exactly 12 words');
      return;
    }

    try {
      await restoreWallet(walletName.trim(), mnemonic.trim());
      Alert.alert('Success', 'Wallet restored successfully!', [
        { text: 'OK', onPress: () => navigation.navigate('WalletDashboard' as never) }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to restore wallet. Please check your recovery phrase.');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>
          {activeTab === 'create' ? 'Creating your wallet...' : 'Restoring your wallet...'}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Set Up Your TokToken Wallet</Text>
        
        {/* Tab Selector */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'create' && styles.activeTab]}
            onPress={() => setActiveTab('create')}
          >
            <Text style={[styles.tabText, activeTab === 'create' && styles.activeTabText]}>
              Create New Wallet
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'restore' && styles.activeTab]}
            onPress={() => setActiveTab('restore')}
          >
            <Text style={[styles.tabText, activeTab === 'restore' && styles.activeTabText]}>
              Recover Wallet
            </Text>
          </TouchableOpacity>
        </View>

        {/* Create Wallet Tab */}
        {activeTab === 'create' && (
          <View style={styles.formContainer}>
            <Text style={styles.description}>
              Create a brand new wallet with a newly generated recovery phrase.
            </Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Wallet Name</Text>
              <TextInput
                style={styles.input}
                value={walletName}
                onChangeText={setWalletName}
                placeholder="My Wallet"
                autoCapitalize="none"
              />
            </View>
            
            <TouchableOpacity style={styles.button} onPress={handleCreateWallet}>
              <Text style={styles.buttonText}>Create New Wallet</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Restore Wallet Tab */}
        {activeTab === 'restore' && (
          <View style={styles.formContainer}>
            <Text style={styles.description}>
              Restore an existing wallet using your 12-word recovery phrase.
            </Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Wallet Name</Text>
              <TextInput
                style={styles.input}
                value={walletName}
                onChangeText={setWalletName}
                placeholder="My Wallet"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Recovery Phrase (12 words)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={mnemonic}
                onChangeText={setMnemonic}
                placeholder="Enter your 12-word recovery phrase..."
                multiline
                numberOfLines={4}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <Text style={styles.helperText}>
                Enter all 12 words in the correct order, separated by spaces.
              </Text>
            </View>
            
            <TouchableOpacity style={styles.button} onPress={handleRestoreWallet}>
              <Text style={styles.buttonText}>Recover Wallet</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 24,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#ffffff',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#111827',
  },
  formContainer: {
    marginBottom: 20,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  helperText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  button: {
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SetupWalletScreen;