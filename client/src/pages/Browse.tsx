import { Layout } from "@/components/Layout";
import { rinks, getAllStates, getAllCities, isTruthy } from "@/lib/data";
import { RinkCard } from "@/components/RinkCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import { useHead } from "@/hooks/use-head";
import { buildRinkItemList } from "@/lib/seo";

export default function Browse() {
  useHead({
    title: "Browse Rinks",
    description: "Browse ice skating rinks across 11 states. Search by city or state to find public skating times, freestyle sessions, skate sharpening, and hockey programs near you.",
    canonicalPath: "/browse",
    structuredData: [buildRinkItemList(rinks, "/browse", "Ice Skating Rinks Directory")],
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState<string>("all");
  const [filters, setFilters] = useState({
    publicSkating: false,
    freestyle: false,
    rentals: false,
    sharpening: false,
  });

  const states = useMemo(() => getAllStates(), []);
  
  const filteredRinks = useMemo(() => {
    return rinks.filter((rink) => {
      const matchesSearch = 
        rink.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rink.address.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rink.address.state.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesState = selectedState === "all" || rink.address.state === selectedState;

      if (filters.publicSkating && !isTruthy(rink.offerings.public_skating)) return false;
      if (filters.freestyle && !isTruthy(rink.freestyle.available)) return false;
      if (filters.rentals && !isTruthy(rink.rentals.available)) return false;
      if (filters.sharpening && !isTruthy(rink.sharpening.available)) return false;

      return matchesSearch && matchesState;
    });
  }, [searchQuery, selectedState, filters]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedState("all");
    setFilters({
      publicSkating: false,
      freestyle: false,
      rentals: false,
      sharpening: false,
    });
  };

  return (
    <Layout>
      <div className="page-band border-b border-white/10">
        <div className="container mx-auto px-4 py-12">
          <p className="mb-3 text-sm font-semibold uppercase text-cyan-200">National rink directory</p>
          <h1 className="font-serif text-4xl font-extrabold mb-4 text-white">Browse ice skating rinks</h1>
          <p className="text-white/70 max-w-2xl">
            Browse ice skating rinks across 11 states. Search by city or state to find public skating times, freestyle sessions, skate sharpening, and hockey programs near you.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="h-fit w-full flex-shrink-0 space-y-7 rounded-lg border bg-white p-5 shadow-sm lg:sticky lg:top-24 lg:w-64">
            <div>
              <Label className="mb-2 block font-semibold">State</Label>
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger>
                  <SelectValue placeholder="All States" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All States</SelectItem>
                  {states.map((state) => (
                    <SelectItem key={state} value={state}>{state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <Label className="font-semibold block">Offerings</Label>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="public" 
                  checked={filters.publicSkating}
                  onCheckedChange={(c) => setFilters(prev => ({...prev, publicSkating: c as boolean}))}
                />
                <label htmlFor="public" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Public Skating
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="freestyle"
                  checked={filters.freestyle}
                  onCheckedChange={(c) => setFilters(prev => ({...prev, freestyle: c as boolean}))} 
                />
                <label htmlFor="freestyle" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Freestyle Sessions
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="rentals" 
                  checked={filters.rentals}
                  onCheckedChange={(c) => setFilters(prev => ({...prev, rentals: c as boolean}))}
                />
                <label htmlFor="rentals" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Rentals</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="sharpening" 
                  checked={filters.sharpening}
                  onCheckedChange={(c) => setFilters(prev => ({...prev, sharpening: c as boolean}))}
                />
                <label htmlFor="sharpening" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Sharpening</label>
              </div>
            </div>

            <Button variant="outline" className="w-full" onClick={clearFilters}>
              <X className="mr-2 h-4 w-4" /> Clear Filters
            </Button>
          </aside>

          <div className="flex-1">
            <div className="mb-4 relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by rink, city, or state"
                className="h-11 bg-white pl-10"
              />
            </div>
            <p className="mb-6 text-sm text-muted-foreground">
              Showing <strong className="text-foreground">{filteredRinks.length}</strong> rinks
            </p>
            {filteredRinks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredRinks.map((rink) => (
                  <RinkCard key={rink.id} rink={rink} />
                ))}
              </div>
            ) : (
              <div className="border bg-white p-10 text-center">
                <h2 className="font-semibold">No rinks match those filters</h2>
                <p className="mt-2 text-sm text-muted-foreground">Clear the filters or try a broader city, state, or rink name.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
