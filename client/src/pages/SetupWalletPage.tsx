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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { z } from 'zod';

// Extended schema for recovery
const recoverySchema = z.object({
  walletName: z.string().min(1, "Wallet name is required"),
  mnemonic: z.string()
    .min(1, "Recovery phrase is required")
    .refine(
      (value) => value.trim().split(/\s+/).length === 12,
      "Recovery phrase must be exactly 12 words"
    )
});

type RecoveryFormData = z.infer<typeof recoverySchema>;

const SetupWalletPage: React.FC = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("create");
  const [loadingMessage, setLoadingMessage] = useState<string>("Creating your wallet...");

  // Form for creating a new wallet
  const createForm = useForm<WalletSetup>({
    resolver: zodResolver(walletSetupSchema),
    defaultValues: {
      walletName: '',
    },
  });

  // Form for recovering an existing wallet
  const recoveryForm = useForm<RecoveryFormData>({
    resolver: zodResolver(recoverySchema),
    defaultValues: {
      walletName: '',
      mnemonic: '',
    },
  });

  // Handle new wallet creation
  const onCreateSubmit = async (data: WalletSetup) => {
    try {
      setLoadingMessage("Creating your wallet...");
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

  // Handle wallet recovery
  const onRecoverySubmit = async (data: RecoveryFormData) => {
    try {
      setLoadingMessage("Recovering your wallet...");
      setIsLoading(true);
      const response = await apiRequest('POST', '/api/wallet/restore', data);
      
      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Wallet recovered successfully!',
        });
        navigate('/'); // Go directly to the dashboard
      }
    } catch (error) {
      toast({
        title: 'Recovery Failed',
        description: error instanceof Error ? error.message : 'Failed to recover wallet. Please check your recovery phrase.',
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
          
          <Tabs defaultValue="create" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="create">Create New Wallet</TabsTrigger>
              <TabsTrigger value="recover">Recover Wallet</TabsTrigger>
            </TabsList>
            
            <TabsContent value="create">
              <div className="text-sm text-gray-600 mb-4">
                Create a brand new wallet with a newly generated recovery phrase.
              </div>
              
              <Form {...createForm}>
                <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="space-y-6">
                  <FormField
                    control={createForm.control}
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
                      Create New Wallet
                    </Button>
                  </div>
                </form>
              </Form>
            </TabsContent>
            
            <TabsContent value="recover">
              <div className="text-sm text-gray-600 mb-4">
                Restore an existing wallet using your 12-word recovery phrase.
              </div>
              
              <Form {...recoveryForm}>
                <form onSubmit={recoveryForm.handleSubmit(onRecoverySubmit)} className="space-y-6">
                  <FormField
                    control={recoveryForm.control}
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
                  
                  <FormField
                    control={recoveryForm.control}
                    name="mnemonic"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="block text-sm font-medium text-gray-700">Recovery Phrase (12 words)</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="Enter your 12-word recovery phrase..." 
                            className="w-full min-h-[120px] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                            required
                          />
                        </FormControl>
                        <p className="text-xs text-gray-500">
                          Enter all 12 words in the correct order, separated by spaces.
                        </p>
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
                      Recover Wallet
                    </Button>
                  </div>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <LoadingOverlay isLoading={isLoading} message={loadingMessage} />
    </div>
  );
};

export default SetupWalletPage;
