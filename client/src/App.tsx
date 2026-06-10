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
import SkateSharpening from "@/pages/SkateSharpening";
import LearnToSkate from "@/pages/LearnToSkate";
import NashvilleCityHub from "@/pages/NashvilleCityHub";
import TennesseeStateHub from "@/pages/TennesseeStateHub";
import BlogIndex from "@/pages/BlogIndex";
import BlogPost from "@/pages/BlogPost";
import About from "@/pages/About";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/browse" component={Browse} />
      <Route path="/freestyle" component={FreestyleHub} />
      <Route path="/services/skate-sharpening" component={SkateSharpening} />
      <Route path="/services/learn-to-skate" component={LearnToSkate} />
      <Route path="/city/tn/nashville" component={NashvilleCityHub} />
      <Route path="/blog" component={BlogIndex} />
      <Route path="/blog/:slug" component={BlogPost} />
      <Route path="/about" component={About} />

      {/* State-specific hubs (must come before generic /state/:state) */}
      <Route path="/state/tn" component={TennesseeStateHub} />

      {/* Dynamic Routes */}
      <Route path="/rink/:slug" component={RinkDetail} />
      <Route path="/state/:state" component={StateHub} />
      <Route path="/city/:state/:city" component={CityHub} />
      
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
