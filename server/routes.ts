import express, { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { ethers } from "ethers";
import { 
  walletSetupSchema, 
  insertUserSchema, 
  type WalletSetup,
  type InsertUser
} from "@shared/schema";
import { z } from "zod";
import { SessionData } from "express-session";

// Extend Express session with our custom properties
declare module "express-session" {
  interface SessionData {
    mnemonic?: string;
    walletAddress?: string;
  }
}

// Generate a random username for demo purposes
function generateRandomUsername() {
  return `user_${Math.random().toString(36).substring(2, 10)}`;
}

// Get an Ethereum provider
function getProvider() {
  const NETWORK = "sepolia";
  const INFURA_API_KEY = process.env.INFURA_API_KEY || "9aa3d95b3bc440fa88ea12eaa4456161"; // Default public key
  return new ethers.InfuraProvider(NETWORK, INFURA_API_KEY);
}

// Generate a wallet with a 22-word mnemonic
function generateWallet() {
  // Generate wallet with random mnemonic (using Wallet.createRandom())
  const randomWallet = ethers.Wallet.createRandom();
  const fullMnemonic = randomWallet.mnemonic?.phrase || "";
  
  // Take only the first 22 words for our requirement
  const words = fullMnemonic.split(" ");
  const mnemonic22Words = words.slice(0, 22).join(" ");
  
  // Create a wallet from the mnemonic
  const mnemonicWallet = ethers.Wallet.fromPhrase(mnemonic22Words);
  
  return {
    mnemonic: mnemonic22Words,
    address: mnemonicWallet.address,
    privateKey: mnemonicWallet.privateKey,
  };
}

// Get ETH balance for an address
async function getEthBalance(address: string): Promise<string> {
  try {
    const provider = getProvider();
    const balance = await provider.getBalance(address);
    return ethers.formatEther(balance);
  } catch (error) {
    console.error("Error fetching ETH balance:", error);
    return "0.0";
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Create HTTP server
  const httpServer = createServer(app);

  // Setup wallet routes with /api prefix
  const apiRouter = express.Router();

  // Create a new wallet
  apiRouter.post("/wallet/create", async (req: Request, res: Response) => {
    try {
      // Validate request body against schema
      const data = walletSetupSchema.parse(req.body);
      
      // Generate a new wallet
      const wallet = generateWallet();
      
      // Create user in storage
      const newUser: InsertUser = {
        username: generateRandomUsername(),
        walletName: data.walletName,
        walletAddress: wallet.address,
        encryptedMnemonic: wallet.mnemonic, // In a real app, this should be encrypted
      };
      
      await storage.createUser(newUser);
      
      // For demo purposes, we store the mnemonic in session
      req.session.mnemonic = wallet.mnemonic;
      req.session.walletAddress = wallet.address;
      
      res.status(201).json({ success: true });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          message: "Invalid wallet setup data", 
          errors: error.errors 
        });
      } else {
        console.error("Error creating wallet:", error);
        res.status(500).json({ message: "Failed to create wallet" });
      }
    }
  });

  // Get recovery phrase
  apiRouter.get("/wallet/recovery-phrase", async (req: Request, res: Response) => {
    try {
      // For demo purposes, get the mnemonic from session
      if (!req.session?.mnemonic || !req.session?.walletAddress) {
        return res.status(404).json({ message: "No wallet found. Please create a wallet first." });
      }
      
      res.json({ 
        mnemonic: req.session.mnemonic,
        walletAddress: req.session.walletAddress
      });
    } catch (error) {
      console.error("Error getting recovery phrase:", error);
      res.status(500).json({ message: "Failed to get recovery phrase" });
    }
  });

  // Get wallet info including balance
  apiRouter.get("/wallet/info", async (req: Request, res: Response) => {
    try {
      // For demo purposes, get the wallet from session
      if (!req.session?.walletAddress) {
        return res.status(404).json({ message: "No wallet found. Please create a wallet first." });
      }
      
      // Get user data from storage
      const user = await storage.getUserByWalletAddress(req.session.walletAddress);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Get balance from Ethereum network
      const balance = await getEthBalance(user.walletAddress);
      
      res.json({
        walletName: user.walletName,
        walletAddress: user.walletAddress,
        balance: balance
      });
    } catch (error) {
      console.error("Error getting wallet info:", error);
      res.status(500).json({ message: "Failed to get wallet information" });
    }
  });

  // Mount API routes
  app.use("/api", apiRouter);

  return httpServer;
}
