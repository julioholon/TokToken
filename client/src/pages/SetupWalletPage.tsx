import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { apiRequest } from '@/lib/queryClient';
import { walletSetupSchema } from '@shared/schema';
import type { WalletSetup } from '@shared/schema';
import Header from '@/components/Header';
import LoadingOverlay from '@/components/LoadingOverlay';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const SetupWalletPage: React.FC = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<WalletSetup>({
    resolver: zodResolver(walletSetupSchema),
    defaultValues: {
      walletName: '',
    },
  });

  const onSubmit = async (data: WalletSetup) => {
    try {
      setIsLoading(true);
      const response = await apiRequest('POST', '/api/wallet/create', data);
      
      if (response.ok) {
        navigate('/recovery-phrase');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create wallet',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header showNetworkBadge={false} />
      
      <main className="flex-grow px-4 py-6">
        <div className="max-w-md mx-auto">
          <h2 className="text-xl font-semibold mb-6">Set Up Your Wallet</h2>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="walletName"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="block text-sm font-medium text-gray-700">Wallet Name</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="My Wallet" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="pt-2">
                <Button 
                  type="submit"
                  className="w-full bg-primary hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                  disabled={isLoading}
                >
                  Continue
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </main>
      
      <LoadingOverlay isLoading={isLoading} message="Creating your wallet..." />
    </div>
  );
};

export default SetupWalletPage;
