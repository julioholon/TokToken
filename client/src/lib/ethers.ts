import { ethers } from "ethers";

// Use Sepolia testnet configuration
const NETWORK = "sepolia";
const INFURA_API_KEY = process.env.INFURA_API_KEY || "9aa3d95b3bc440fa88ea12eaa4456161"; // Default public key

// Ethereum provider for Sepolia testnet
export const getProvider = () => {
  return new ethers.InfuraProvider(NETWORK, INFURA_API_KEY);
};

// Get ETH balance for an address
export const getEthBalance = async (address: string): Promise<string> => {
  try {
    const provider = getProvider();
    const balance = await provider.getBalance(address);
    return ethers.formatEther(balance);
  } catch (error) {
    console.error("Error fetching ETH balance:", error);
    throw new Error("Failed to fetch ETH balance");
  }
};

// Validate if an address is a valid Ethereum address
export const isValidEthereumAddress = (address: string): boolean => {
  try {
    return ethers.isAddress(address);
  } catch (error) {
    return false;
  }
};
