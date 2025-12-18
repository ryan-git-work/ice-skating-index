import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Search } from "lucide-react";

export function Hero() {
  return (
    <div className="relative overflow-hidden bg-background pt-16 pb-24 lg:pt-32 lg:pb-40">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6">
            Find Your <span className="text-primary italic">Ice</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            The comprehensive directory for ice rinks, public skating schedules, freestyle sessions, and hockey programs across the country.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/browse">
              <Button size="lg" className="h-12 px-8 text-base shadow-lg shadow-primary/20 transition-all hover:scale-105">
                <Search className="mr-2 h-4 w-4" />
                Find a Rink
              </Button>
            </Link>
            <Link href="/state/TN">
              <Button variant="outline" size="lg" className="h-12 px-8 text-base bg-background/50 backdrop-blur-sm">
                Explore Tennessee <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl -z-10 pointer-events-none opacity-40">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl mix-blend-multiply animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl mix-blend-multiply animate-pulse" style={{ animationDuration: '6s' }} />
      </div>
    </div>
  );
}
