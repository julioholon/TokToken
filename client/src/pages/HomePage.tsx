import React from "react";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";

const HomePage: React.FC = () => {
  const [, navigate] = useLocation();

  const handleCreateWallet = () => {
    navigate("/setup");
  };

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
            Create New Wallet
          </Button>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
