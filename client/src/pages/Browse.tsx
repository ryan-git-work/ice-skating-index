import { Layout } from "@/components/Layout";
import { rinks, getAllStates, getAllCities } from "@/lib/data";
import { RinkCard } from "@/components/RinkCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useMemo } from "react";
import { Search, Filter, X } from "lucide-react";
import { useHead } from "@/hooks/use-head";

export default function Browse() {
  useHead({
    title: "Browse Rinks",
    description: "Search and filter ice skating rinks by state, city, and amenities."
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
      // Search Text
      const matchesSearch = 
        rink.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rink.address.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rink.address.state.toLowerCase().includes(searchQuery.toLowerCase());

      // State Filter
      const matchesState = selectedState === "all" || rink.address.state === selectedState;

      // Checkbox Filters
      if (filters.publicSkating && !rink.offerings.public_skating) return false;
      if (filters.freestyle && !rink.freestyle.available) return false;
      if (filters.rentals && !rink.rentals.available) return false;
      if (filters.sharpening && !rink.sharpening.available) return false;

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
            Filter by location, amenities, and programs to find the perfect ice for your needs.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
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
                <label htmlFor="rentals" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Skate Rentals
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="sharpening" 
                  checked={filters.sharpening}
                  onCheckedChange={(c) => setFilters(prev => ({...prev, sharpening: c as boolean}))}
                />
                <label htmlFor="sharpening" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Skate Sharpening
                </label>
              </div>
            </div>

            <Button 
              variant="outline" 
              className="w-full text-muted-foreground hover:text-foreground"
              onClick={clearFilters}
            >
              Clear Filters
            </Button>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by name, city, or keyword..." 
                className="pl-10 h-12 text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="mb-4 text-sm text-muted-foreground font-medium">
              Showing {filteredRinks.length} rinks
            </div>

            {filteredRinks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRinks.map((rink) => (
                  <RinkCard key={rink.id} rink={rink} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 border rounded-lg bg-muted/10">
                <p className="text-muted-foreground text-lg">No rinks found matching your filters.</p>
                <Button variant="link" onClick={clearFilters} className="mt-2">Reset all filters</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
