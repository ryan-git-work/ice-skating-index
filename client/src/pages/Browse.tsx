import { Layout } from "@/components/Layout";
import { rinks, getAllStates, getAllCities, isTruthy } from "@/lib/data";
import { RinkCard } from "@/components/RinkCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useMemo } from "react";
import { Search, Filter, X } from "lucide-react";
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
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-12">
          <h1 className="font-serif text-4xl font-bold mb-4">Browse Rinks</h1>
          <p className="text-muted-foreground max-w-2xl">
            Browse ice skating rinks across 11 states. Search by city or state to find public skating times, freestyle sessions, skate sharpening, and hockey programs near you.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-64 space-y-8 flex-shrink-0">
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
            <div className="mb-6 flex items-center gap-3">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by rink, city, or state"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredRinks.map((rink) => (
                <RinkCard key={rink.id} rink={rink} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
