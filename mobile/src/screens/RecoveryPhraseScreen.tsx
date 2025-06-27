import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useNavigation } from '@react-navigation/native';
import { useWallet } from '../contexts/WalletContext';

const RecoveryPhraseScreen = () => {
  const navigation = useNavigation();
  const { wallet } = useWallet();
  const [showPhrase, setShowPhrase] = useState(false);

  const handleCopyToClipboard = async () => {
    if (!wallet?.mnemonic) return;
    
    try {
      await Clipboard.setStringAsync(wallet.mnemonic);
      Alert.alert('Success', 'Recovery phrase copied to clipboard!');
    } catch (error) {
      Alert.alert('Error', 'Failed to copy to clipboard');
    }
  };

  const handleContinue = () => {
    navigation.navigate('WalletDashboard' as never);
  };

  const handleRevealPhrase = () => {
    Alert.alert(
      'Security Warning',
      'Make sure no one is looking at your screen before revealing your recovery phrase.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'I Understand', onPress: () => setShowPhrase(true) }
      ]
    );
  };

  const wordList = wallet?.mnemonic ? wallet.mnemonic.split(' ') : [];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Your TokToken Wallet Recovery Phrase</Text>
        <Text style={styles.description}>
          Write these words down and store them in a secure location. They are the only way to recover your wallet.
        </Text>
        
        <View style={styles.phraseContainer}>
          {!showPhrase ? (
            <View style={styles.hiddenContainer}>
              <Text style={styles.hiddenText}>🔒 Recovery Phrase Hidden</Text>
              <Text style={styles.hiddenSubtext}>
                Tap below to reveal your recovery phrase
              </Text>
              <TouchableOpacity style={styles.revealButton} onPress={handleRevealPhrase}>
                <Text style={styles.revealButtonText}>Reveal Recovery Phrase</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <View style={styles.wordGrid}>
                {wordList.map((word, index) => (
                  <View key={index} style={styles.wordContainer}>
                    <Text style={styles.wordNumber}>{index + 1}</Text>
                    <Text style={styles.word}>{word}</Text>
                  </View>
                ))}
              </View>
              
              <TouchableOpacity style={styles.copyButton} onPress={handleCopyToClipboard}>
                <Text style={styles.copyButtonText}>📋 Copy to Clipboard</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
        
        <View style={styles.warningContainer}>
          <Text style={styles.warningText}>
            <Text style={styles.warningBold}>Important:</Text> Never share your recovery phrase with anyone. Anyone with these words can access your funds.
          </Text>
        </View>
        
        {showPhrase && (
          <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
            <Text style={styles.continueButtonText}>I've Saved My Recovery Phrase</Text>
          </TouchableOpacity>
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
  content: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  phraseContainer: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  hiddenContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  hiddenText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  hiddenSubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
    textAlign: 'center',
  },
  revealButton: {
    backgroundColor: '#F59E0B',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  revealButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  wordGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  wordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginBottom: 8,
    width: '48%',
  },
  wordNumber: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    marginRight: 8,
    minWidth: 16,
  },
  word: {
    fontSize: 14,
    fontFamily: 'monospace',
    color: '#111827',
    flex: 1,
  },
  copyButton: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  copyButtonText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '500',
  },
  warningContainer: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#F59E0B',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  warningText: {
    fontSize: 14,
    color: '#92400E',
    lineHeight: 20,
  },
  warningBold: {
    fontWeight: '600',
  },
  continueButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default RecoveryPhraseScreen;