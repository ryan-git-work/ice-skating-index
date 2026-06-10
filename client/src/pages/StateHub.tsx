import { Layout } from "@/components/Layout";
import { rinks, getRinksByState } from "@/lib/data";
import { RinkCard } from "@/components/RinkCard";
import { Link, useParams } from "wouter";
import { useHead } from "@/hooks/use-head";
import { EmailOptIn } from "@/components/EmailOptIn";
import { LastVerified } from "@/components/LastVerified";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { buildRinkItemList } from "@/lib/seo";

const STATE_NAMES: Record<string, string> = {
  tn: "Tennessee",
  ny: "New York",
  ca: "California",
  mi: "Michigan",
  mn: "Minnesota",
  ma: "Massachusetts",
  co: "Colorado",
  tx: "Texas",
  il: "Illinois",
  pa: "Pennsylvania",
  oh: "Ohio",
};

function slugifyCity(city: string) {
  return city.toLowerCase().replace(/\s+/g, "-");
}

export default function StateHub() {
  const params = useParams();
  const state = (params.state || "").toLowerCase();
  const stateName = STATE_NAMES[state] || state.toUpperCase();
  const stateRinks = getRinksByState(state);

  useHead({
    title: `Ice Skating Rinks in ${stateName}`,
    description: `Find the best ice skating rinks in ${stateName}. Browse public skating schedules, freestyle sessions, learn-to-skate programs, and hockey rinks across ${stateName}'s top cities.`,
    canonicalPath: `/state/${state}`,
    structuredData: [buildRinkItemList(stateRinks, `/state/${state}`, `Ice Skating Rinks in ${stateName}`)],
  });

  if (stateRinks.length === 0) {
    return (
        <Layout>
            <div className="container mx-auto px-4 py-20 text-center">
                <h1 className="text-3xl font-serif mb-4">No rinks found for {stateName}</h1>
                <Link href="/browse"><Button>Browse all rinks</Button></Link>
            </div>
        </Layout>
    )
  }

  const cities = Array.from(new Set(stateRinks.map(r => r.address.city))).sort();

  return (
    <Layout>
       <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-12">
          <Link href="/browse" className="inline-flex items-center text-sm text-muted-foreground mb-4 hover:text-primary">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Browse
          </Link>
          <h1 className="font-serif text-4xl font-bold mb-4">Ice Skating Rinks in {stateName}</h1>
          <p className="text-muted-foreground max-w-2xl">
            Complete directory of ice skating rinks, public skating sessions, freestyle ice, and hockey programs across {stateName}.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* City Links */}
        <div className="mb-12">
            <h2 className="text-lg font-semibold mb-4">Browse by City</h2>
            <div className="flex flex-wrap gap-2">
                {cities.map(city => (
                    <Link key={city} href={`/city/${state}/${slugifyCity(city)}`}>
                        <Button variant="outline" size="sm" className="rounded-full">
                            {city}
                        </Button>
                    </Link>
                ))}
            </div>
        </div>

        <h2 className="font-serif text-2xl font-bold mb-6">All Rinks in {stateName}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stateRinks.map(rink => (
                <RinkCard key={rink.id} rink={rink} />
            ))}
        </div>

        <div className="pt-12 space-y-8">
          <EmailOptIn cityName={stateName} />
          <LastVerified date="2026-05-23" />
        </div>
      </div>
    </Layout>
  );
}
