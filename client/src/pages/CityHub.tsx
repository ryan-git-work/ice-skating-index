import { Layout } from "@/components/Layout";
import { getRinksByCity } from "@/lib/data";
import { RinkCard } from "@/components/RinkCard";
import { Link, useParams } from "wouter";
import { useHead } from "@/hooks/use-head";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function CityHub() {
  const params = useParams();
  const state = params.state || "";
  const city = decodeURIComponent(params.city || "");
  const cityRinks = getRinksByCity(state, city);

  useHead({
    title: `Ice Skating Rinks in ${city}, ${state}`,
    description: `Find ice rinks, public skating, and freestyle sessions in ${city}, ${state}.`
  });

  return (
    <Layout>
       <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center text-sm text-muted-foreground mb-4">
             <Link href={`/state/${state}`} className="inline-flex items-center hover:text-primary">
                <ArrowLeft className="h-4 w-4 mr-1" /> Back to {state}
             </Link>
          </div>
          <h1 className="font-serif text-4xl font-bold mb-4">Ice Skating in {city}</h1>
          <p className="text-muted-foreground max-w-2xl">
             Explore {cityRinks.length} ice rink{cityRinks.length !== 1 ? 's' : ''} in {city}, {state}.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cityRinks.map(rink => (
                <RinkCard key={rink.id} rink={rink} />
            ))}
        </div>
      </div>
    </Layout>
  );
}
