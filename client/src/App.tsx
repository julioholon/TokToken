import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/HomePage";
import SetupWalletPage from "@/pages/SetupWalletPage";
import RecoveryPhrasePage from "@/pages/RecoveryPhrasePage";
import WalletDashboardPage from "@/pages/WalletDashboardPage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/setup" component={SetupWalletPage} />
      <Route path="/recovery-phrase" component={RecoveryPhrasePage} />
      <Route path="/dashboard" component={WalletDashboardPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
