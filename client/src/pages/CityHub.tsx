import { Layout } from "@/components/Layout";
import { getRinksByCity } from "@/lib/data";
import { RinkCard } from "@/components/RinkCard";
import { Link, useParams } from "wouter";
import { useHead } from "@/hooks/use-head";
import { EmailOptIn } from "@/components/EmailOptIn";
import { LastVerified } from "@/components/LastVerified";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const STATE_NAMES: Record<string, string> = {
  tn: "Tennessee",
  ny: "New York",
  ca: "California",
  il: "Illinois",
  co: "Colorado",
  ma: "Massachusetts",
  mi: "Michigan",
  mn: "Minnesota",
  oh: "Ohio",
  pa: "Pennsylvania",
  tx: "Texas",
};

function formatCityName(slug: string) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function CityHub() {
  const params = useParams();
  const stateSlug = (params.state || "").toLowerCase();
  const citySlug = decodeURIComponent(params.city || "").toLowerCase();
  const city = formatCityName(citySlug);
  const stateName = STATE_NAMES[stateSlug] || stateSlug.toUpperCase();
  const cityRinks = getRinksByCity(stateSlug, citySlug);

  useHead({
    title: `Ice Skating Rinks in ${city}, ${stateName}`,
    description: `Find ice rinks, public skating, and freestyle sessions in ${city}, ${stateName}.`,
  });

  return (
    <Layout>
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center text-sm text-muted-foreground mb-4 gap-2">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <Link href={`/state/${stateSlug}`} className="hover:text-primary">{stateName}</Link>
            <span>/</span>
            <span className="text-foreground font-medium">{city}</span>
          </div>
          <h1 className="font-serif text-4xl font-bold mb-4">Ice Skating in {city}, {stateName}</h1>
          <p className="text-muted-foreground max-w-2xl">
            Coming soon — full guide loading shortly.
          </p>
        </div>
      </div>

      {cityRinks.length > 0 && (
        <div className="container mx-auto px-4 py-12">
          <h2 className="font-serif text-2xl font-bold mb-6">Rinks in {city}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cityRinks.map((rink) => (
              <RinkCard key={rink.id} rink={rink} />
            ))}
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 pb-12 space-y-8">
        <EmailOptIn cityName={city} />
        <LastVerified date="2026-05-23" />
      </div>
    </Layout>
  );
}
