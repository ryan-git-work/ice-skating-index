import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Search } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-[520px] max-h-[680px] overflow-hidden bg-[#0E2A47]">
      <img
        src="/images/skating/ice_img_08.png"
        alt="A full-size indoor ice rink ready for skating"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-[#0E2A47]/80" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex min-h-[520px] max-w-3xl flex-col justify-center py-16 text-white">
          <p className="mb-4 text-sm font-semibold uppercase text-cyan-200">Ice Skating Index</p>
          <h1 className="font-serif text-4xl md:text-6xl font-extrabold text-white mb-6">
            Find ice skating near you
          </h1>
          <p className="text-lg text-white/75 mb-9 max-w-2xl leading-relaxed">
            Compare public-skate schedules, freestyle ice, lessons, prices, and current rink details before you make the drive.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 items-start">
            <Link href="/browse">
              <Button size="lg" className="h-12 px-7 bg-[#2E7FD1] text-base text-white hover:bg-[#246EB8]">
                <Search className="mr-2 h-4 w-4" />
                Find a rink
              </Button>
            </Link>
            <Link href="/browse">
              <Button variant="outline" size="lg" className="h-12 px-7 border-white/45 bg-transparent text-base text-white hover:bg-white/10 hover:text-white">
                Browse all states <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
