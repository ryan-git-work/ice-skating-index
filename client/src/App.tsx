import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import Home from "@/pages/Home";
import Browse from "@/pages/Browse";
import RinkDetail from "@/pages/RinkDetail";
import StateHub from "@/pages/StateHub";
import CityHub from "@/pages/CityHub";
import FreestyleHub from "@/pages/FreestyleHub";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/browse" component={Browse} />
      <Route path="/freestyle" component={FreestyleHub} />
      
      {/* Dynamic Routes */}
      <Route path="/rink/:slug" component={RinkDetail} />
      <Route path="/state/:state" component={StateHub} />
      <Route path="/state/:state/:city" component={CityHub} />
      
      {/* Fallback */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
