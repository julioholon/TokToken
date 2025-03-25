import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import LoadingOverlay from '@/components/LoadingOverlay';
import Notification from '@/components/Notification';
import { useToast } from '@/hooks/use-toast';
import type { RecoveryPhraseResponse } from '@shared/schema';

const RecoveryPhrasePage: React.FC = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [notification, setNotification] = useState<{ show: boolean; message: string; type: 'success' | 'error' | 'info' }>({
    show: false,
    message: '',
    type: 'info',
  });

  const { data, isLoading, error } = useQuery<RecoveryPhraseResponse>({
    queryKey: ['/api/wallet/recovery-phrase'],
    retry: false,
  });

  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to load recovery phrase',
        variant: 'destructive',
      });
      navigate('/setup');
    }
  }, [error, toast, navigate]);

  const handleCopyToClipboard = async () => {
    if (!data?.mnemonic) return;
    
    try {
      await navigator.clipboard.writeText(data.mnemonic);
      setNotification({
        show: true,
        message: 'Recovery phrase copied to clipboard!',
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

  const handleContinue = () => {
    navigate('/dashboard');
  };

  const wordList = data?.mnemonic ? data.mnemonic.split(' ') : [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header showNetworkBadge={false} />
      
      <main className="flex-grow px-4 py-6">
        <div className="max-w-md mx-auto space-y-6">
          <div className="space-y-2 text-center">
            <h2 className="text-xl font-semibold">Your Wallet Recovery Phrase</h2>
            <p className="text-sm text-gray-600">
              Write these words down and store them in a secure location. They are the only way to recover your wallet.
            </p>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="recovery-phrase text-sm mb-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
              {wordList.map((word, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                  <span className="text-xs text-gray-500 font-medium">{index + 1}</span>
                  <span className="font-mono">{word}</span>
                </div>
              ))}
            </div>
            
            <Button 
              variant="outline"
              className="w-full flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors duration-200"
              onClick={handleCopyToClipboard}
            >
              <span className="material-icons text-sm">content_copy</span>
              <span>Copy to Clipboard</span>
            </Button>
          </div>
          
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-700 text-sm">
              <span className="font-medium">Important:</span> Never share your recovery phrase with anyone. Anyone with these words can access your funds.
            </p>
          </div>
          
          <div className="pt-2">
            <Button 
              className="w-full bg-primary hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
              onClick={handleContinue}
            >
              I've Saved My Recovery Phrase
            </Button>
          </div>
        </div>
      </main>
      
      <Notification
        isVisible={notification.show}
        message={notification.message}
        type={notification.type}
        onClose={handleCloseNotification}
      />
      
      <LoadingOverlay isLoading={isLoading} message="Generating your secure recovery phrase..." />
    </div>
  );
};

export default RecoveryPhrasePage;
