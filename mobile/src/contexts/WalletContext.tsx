import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { ethers } from 'ethers';

interface WalletData {
  walletName: string;
  walletAddress: string;
  mnemonic: string;
}

interface WalletContextType {
  wallet: WalletData | null;
  isLoading: boolean;
  createWallet: (walletName: string) => Promise<void>;
  restoreWallet: (walletName: string, mnemonic: string) => Promise<void>;
  removeWallet: () => Promise<void>;
  getBalance: () => Promise<string>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadWallet();
  }, []);

  const loadWallet = async () => {
    try {
      const storedWallet = await SecureStore.getItemAsync('wallet_data');
      if (storedWallet) {
        setWallet(JSON.parse(storedWallet));
      }
    } catch (error) {
      console.error('Error loading wallet:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createWallet = async (walletName: string) => {
    try {
      setIsLoading(true);
      
      // Generate a new wallet
      const newWallet = ethers.Wallet.createRandom();
      const walletData: WalletData = {
        walletName,
        walletAddress: newWallet.address,
        mnemonic: newWallet.mnemonic?.phrase || '',
      };

      // Store securely
      await SecureStore.setItemAsync('wallet_data', JSON.stringify(walletData));
      setWallet(walletData);
    } catch (error) {
      console.error('Error creating wallet:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const restoreWallet = async (walletName: string, mnemonic: string) => {
    try {
      setIsLoading(true);
      
      // Validate and restore wallet from mnemonic
      const restoredWallet = ethers.Wallet.fromPhrase(mnemonic.trim());
      const walletData: WalletData = {
        walletName,
        walletAddress: restoredWallet.address,
        mnemonic: mnemonic.trim(),
      };

      // Store securely
      await SecureStore.setItemAsync('wallet_data', JSON.stringify(walletData));
      setWallet(walletData);
    } catch (error) {
      console.error('Error restoring wallet:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const removeWallet = async () => {
    try {
      await SecureStore.deleteItemAsync('wallet_data');
      setWallet(null);
    } catch (error) {
      console.error('Error removing wallet:', error);
      throw error;
    }
  };

  const getBalance = async (): Promise<string> => {
    if (!wallet) {
      throw new Error('No wallet available');
    }

    try {
      // Use Alchemy API for Sepolia testnet
      const alchemyKey = 'demo'; // You'll need to replace this with actual API key
      const provider = new ethers.JsonRpcProvider(
        `https://eth-sepolia.g.alchemy.com/v2/${alchemyKey}`
      );
      
      const balance = await provider.getBalance(wallet.walletAddress);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Error fetching balance:', error);
      throw error;
    }
  };

  return (
    <WalletContext.Provider
      value={{
        wallet,
        isLoading,
        createWallet,
        restoreWallet,
        removeWallet,
        getBalance,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};