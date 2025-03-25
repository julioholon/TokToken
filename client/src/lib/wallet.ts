import { ethers } from "ethers";

// Generate a random mnemonic (22 words) and associated wallet
export const generateWallet = (): { 
  mnemonic: string; 
  address: string;
  privateKey: string;
} => {
  // Generate a random mnemonic with the default entropy (16 bytes = 128 bits)
  // This will give 12 words by default
  const wallet = ethers.Wallet.createRandom();
  
  // For 22 words, we need to generate more entropy and create a custom mnemonic
  // 22 words requires approximately 256 bits of entropy (22 * 11 bits per word)
  const entropyBytes = ethers.randomBytes(32); // 32 bytes = 256 bits
  
  // Generate mnemonic from entropy (this will be 24 words actually)
  const fullMnemonic = ethers.HDNodeWallet.entropyToMnemonic(entropyBytes);
  
  // Take only the first 22 words
  const words = fullMnemonic.split(" ");
  const mnemonic22Words = words.slice(0, 22).join(" ");
  
  // Derive wallet from the mnemonic
  const mnemonicWallet = ethers.Wallet.fromPhrase(mnemonic22Words);
  
  return {
    mnemonic: mnemonic22Words,
    address: mnemonicWallet.address,
    privateKey: mnemonicWallet.privateKey,
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
