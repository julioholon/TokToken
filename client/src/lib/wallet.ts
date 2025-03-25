import { ethers } from "ethers";

// Generate a random mnemonic (12 words) and associated wallet
export const generateWallet = (): { 
  mnemonic: string; 
  address: string;
  privateKey: string;
} => {
  // Generate a random mnemonic with the default entropy (16 bytes = 128 bits)
  // This will give 12 words by default
  const wallet = ethers.Wallet.createRandom();
  
  return {
    mnemonic: wallet.mnemonic.phrase,
    address: wallet.address,
    privateKey: wallet.privateKey,
  };
};

// Restore a wallet from mnemonic
export const restoreWalletFromMnemonic = (mnemonic: string): { 
  address: string;
  privateKey: string;
} => {
  const wallet = ethers.Wallet.fromPhrase(mnemonic);
  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
  };
};
