import React, { useEffect, useState } from "react";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import LoadingOverlay from "@/components/LoadingOverlay";
import type { WalletInfoResponse } from "@shared/schema";

const HomePage: React.FC = () => {
  const [, navigate] = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  // Check if user has a wallet session
  const { data, isLoading: isQueryLoading, error } = useQuery<WalletInfoResponse>({
    queryKey: ['/api/wallet/info'],
    retry: false,
  });

  useEffect(() => {
    // If we finished loading and found a wallet, redirect to dashboard
    if (!isQueryLoading) {
      if (data?.walletAddress) {
        navigate("/dashboard");
      }
      setIsLoading(false);
    }
  }, [data, isQueryLoading, navigate]);

  const handleCreateWallet = () => {
    navigate("/setup");
  };

  // If we're still loading or found a wallet, show loading screen
  if (isLoading || data?.walletAddress) {
    return <LoadingOverlay isLoading={true} message="Loading..." />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header showNetworkBadge={false} />
      
      <main className="flex-grow px-4 py-6">
        <div className="h-full flex flex-col items-center justify-center space-y-8 text-center">
          <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="material-icons text-5xl text-primary">account_balance_wallet</span>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Welcome to Crypto Wallet</h2>
            <p className="text-gray-600 max-w-xs mx-auto">
              A simple and secure way to manage your crypto on the Sepolia testnet
            </p>
          </div>
          
          <Button 
            className="w-full max-w-xs bg-primary hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
            onClick={handleCreateWallet}
          >
            Get Started
          </Button>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
