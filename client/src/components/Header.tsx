import React from "react";

interface HeaderProps {
  showNetworkBadge?: boolean;
}

const Header: React.FC<HeaderProps> = ({ showNetworkBadge = true }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-900">Crypto Wallet</h1>
        {showNetworkBadge && (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Sepolia
          </span>
        )}
      </div>
    </header>
  );
};

export default Header;
