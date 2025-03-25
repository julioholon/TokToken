import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  walletName: text("wallet_name").notNull(),
  walletAddress: text("wallet_address").notNull(),
  encryptedMnemonic: text("encrypted_mnemonic").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  walletName: true,
  walletAddress: true,
  encryptedMnemonic: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// API schemas
export const walletSetupSchema = z.object({
  walletName: z.string().min(1, "Wallet name is required"),
});

export type WalletSetup = z.infer<typeof walletSetupSchema>;

export const walletInfoResponseSchema = z.object({
  walletName: z.string(),
  walletAddress: z.string(),
  balance: z.string(),
});

export type WalletInfoResponse = z.infer<typeof walletInfoResponseSchema>;

export const recoveryPhraseResponseSchema = z.object({
  mnemonic: z.string(),
  walletAddress: z.string(),
});

export type RecoveryPhraseResponse = z.infer<typeof recoveryPhraseResponseSchema>;
