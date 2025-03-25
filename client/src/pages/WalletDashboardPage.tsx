import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import Header from '@/components/Header';
import LoadingOverlay from '@/components/LoadingOverlay';
import Notification from '@/components/Notification';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { WalletInfoResponse } from '@shared/schema';

const WalletDashboardPage: React.FC = () => {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [isRemovingAccount, setIsRemovingAccount] = useState(false);
  const [notification, setNotification] = useState<{ show: boolean; message: string; type: 'success' | 'error' | 'info' }>({
    show: false,
    message: '',
    type: 'info',
  });

  const { data, isLoading, error, refetch } = useQuery<WalletInfoResponse>({
    queryKey: ['/api/wallet/info'],
    retry: false,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const handleRefreshBalance = () => {
    refetch();
  };

  const handleCopyWalletAddress = async () => {
    if (!data?.walletAddress) return;
    
    try {
      await navigator.clipboard.writeText(data.walletAddress);
      setNotification({
        show: true,
        message: 'Wallet address copied to clipboard!',
        type: 'success',
      });
    } catch (err) {
      setNotification({
        show: true,
        message: 'Failed to copy to clipboard',
        type: 'error',
      });
    }
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, show: false }));
  };

  const handleRemoveAccount = async () => {
    try {
      setIsRemovingAccount(true);
      const response = await apiRequest('POST', '/api/wallet/remove');
      
      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Account removed successfully!',
        });
        // Redirect to setup page
        navigate('/');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to remove account',
        variant: 'destructive',
      });
    } finally {
      setIsRemovingAccount(false);
    }
  };

  if (error) {
    toast({
      title: 'Error',
      description: error instanceof Error ? error.message : 'Failed to load wallet information',
      variant: 'destructive',
    });
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header showNetworkBadge={true} />
      
      <main className="flex-grow px-4 py-6">
        <div className="max-w-md mx-auto space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold">{data?.walletName || 'My Wallet'}</h2>
            <p className="text-sm text-gray-500">Sepolia Testnet</p>
          </div>
          
          {/* Balance Card */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
            <div className="space-y-1 mb-3">
              <p className="text-blue-100 text-sm">Total Balance</p>
              <div className="flex items-baseline">
                <h3 className="text-3xl font-bold">{isLoading ? '...' : data?.balance || '0.000'}</h3>
                <span className="ml-2 text-blue-100">ETH</span>
              </div>
            </div>
            {isLoading && (
              <div id="balance-loading">
                <div className="animate-pulse h-2 bg-blue-300 bg-opacity-30 rounded"></div>
              </div>
            )}
          </div>
          
          {/* Address Card */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Wallet Address</p>
              <div className="flex items-center justify-between">
                <code 
                  className="text-xs font-mono bg-gray-100 p-2 rounded overflow-x-auto max-w-[200px] cursor-pointer hover:bg-gray-200 transition-colors flex items-center"
                  onClick={handleCopyWalletAddress}
                  title="Click to copy full address"
                >
                  {data?.walletAddress 
                    ? `${data.walletAddress.substring(0, 5)}...${data.walletAddress.substring(data.walletAddress.length - 5)}`
                    : '...'}
                  <span className="material-icons ml-1 text-xs">content_copy</span>
                </code>
              </div>
            </div>
          </div>
          
          {/* Actions Card */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <h3 className="font-medium mb-3">Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <span className="material-icons text-gray-700 mb-2">arrow_downward</span>
                <span className="text-sm">Receive</span>
              </button>
              <button 
                className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={handleRefreshBalance}
              >
                <span className="material-icons text-gray-700 mb-2">refresh</span>
                <span className="text-sm">Refresh</span>
              </button>
            </div>
          </div>

          {/* Remove Account Card */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <h3 className="font-medium mb-3 text-red-600">Danger Zone</h3>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button 
                  className="w-full flex justify-center py-3 px-4 bg-red-50 hover:bg-red-100 text-red-600 font-medium rounded-lg transition-colors"
                  disabled={isRemovingAccount}
                >
                  {isRemovingAccount ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Removing...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <span className="material-icons mr-2 text-sm">delete_forever</span>
                      Remove Account
                    </span>
                  )}
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure you want to remove this account?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action will sign you out, and you'll need your 22-word recovery phrase to access this wallet again.
                    Make sure you have your recovery phrase saved before continuing.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    className="bg-red-600 hover:bg-red-700 text-white"
                    onClick={handleRemoveAccount}
                  >
                    Yes, Remove Account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </main>
      
      <Notification
        isVisible={notification.show}
        message={notification.message}
        type={notification.type}
        onClose={handleCloseNotification}
      />
      
      <LoadingOverlay isLoading={(isLoading && !data) || isRemovingAccount} message={isRemovingAccount ? "Removing account..." : "Loading wallet information..."} />
    </div>
  );
};

export default WalletDashboardPage;
