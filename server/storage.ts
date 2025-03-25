import { users, type User, type InsertUser } from "@shared/schema";
import { Level } from 'level';
import * as path from 'path';

// Interface for wallet storage operations
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUserByWalletAddress(walletAddress: string): Promise<User | undefined>;
  getLatestUser(): Promise<User | undefined>;
}

// LevelDB implementation for persistent storage
export class LevelDBStorage implements IStorage {
  private db: Level<string, any>;
  private counterKey = 'current_id';

  constructor() {
    this.db = new Level(path.join('.', 'wallet-db'));
  }

  private async getCurrentId(): Promise<number> {
    try {
      const id = await this.db.get(this.counterKey);
      return parseInt(id, 10);
    } catch (error) {
      // Counter doesn't exist yet, initialize it
      await this.db.put(this.counterKey, '1');
      return 1;
    }
  }

  private async incrementAndGetId(): Promise<number> {
    const currentId = await this.getCurrentId();
    const nextId = currentId + 1;
    await this.db.put(this.counterKey, nextId.toString());
    return currentId;
  }

  async getUser(id: number): Promise<User | undefined> {
    try {
      const userStr = await this.db.get(`user_${id}`);
      return JSON.parse(userStr);
    } catch (error) {
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const users = await this.getAllUsers();
      return users.find(user => user.username === username);
    } catch (error) {
      console.error('Error finding user by username:', error);
      return undefined;
    }
  }

  async getUserByWalletAddress(walletAddress: string): Promise<User | undefined> {
    try {
      const users = await this.getAllUsers();
      return users.find(user => user.walletAddress === walletAddress);
    } catch (error) {
      console.error('Error finding user by wallet address:', error);
      return undefined;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = await this.incrementAndGetId();
    const user: User = { ...insertUser, id };
    
    await this.db.put(`user_${id}`, JSON.stringify(user));
    return user;
  }

  async getLatestUser(): Promise<User | undefined> {
    try {
      const currentId = await this.getCurrentId();
      if (currentId <= 1) {
        return undefined;
      }
      // The latest user has ID (currentId - 1) since currentId is the next ID to use
      return this.getUser(currentId - 1);
    } catch (error) {
      console.error('Error getting latest user:', error);
      return undefined;
    }
  }

  private async getAllUsers(): Promise<User[]> {
    const users: User[] = [];
    
    try {
      // Iterate over all keys, filtering for user entries
      for await (const [key, value] of this.db.iterator()) {
        if (key.startsWith('user_')) {
          users.push(JSON.parse(value));
        }
      }
    } catch (error) {
      console.error('Error fetching all users:', error);
    }
    
    return users;
  }
}

// In-memory storage fallback (for testing)
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.currentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByWalletAddress(walletAddress: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.walletAddress === walletAddress,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getLatestUser(): Promise<User | undefined> {
    if (this.users.size === 0) return undefined;
    return this.users.get(this.currentId - 1);
  }
}

// Create and export the storage instance - using LevelDB for persistence
export const storage = new LevelDBStorage();
