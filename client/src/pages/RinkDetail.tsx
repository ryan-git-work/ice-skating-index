import { Layout } from "@/components/Layout";
import { rinks, getRinkBySlug } from "@/lib/data";
import { Link, useParams } from "wouter";
import NotFound from "@/pages/not-found";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  MapPin, Globe, Phone, Clock, Calendar, 
  Info, Check, X, ExternalLink, Ticket,
  Snowflake, Dumbbell, Scissors
} from "lucide-react";
import { useHead } from "@/hooks/use-head";

export default function RinkDetail() {
  const params = useParams();
  const rink = getRinkBySlug(params.slug || "");

  useHead({
    title: rink ? rink.name : "Rink Not Found",
    description: rink?.seo.short_description
  });

  if (!rink) {
    return <NotFound />;
  }

  return (
    <Layout>
      {/* Breadcrumbs */}
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-4 text-sm text-muted-foreground">
          <Link href="/">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/browse">Browse</Link>
          <span className="mx-2">/</span>
          <Link href={`/state/${rink.address.state}`}>{rink.address.state}</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground font-medium">{rink.name}</span>
        </div>
      </div>

      {/* Hero Header */}
      <div className="bg-background pt-8 pb-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 text-foreground">{rink.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {rink.address.street}, {rink.address.city}, {rink.address.state} {rink.address.postal_code}
                </div>
                {rink.phone && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-1" />
                    {rink.phone}
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {(rink.tags ?? []).map((tag) => (
                  <Badge key={tag} variant="secondary" className="rounded-full px-3 py-1 font-normal text-sm">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="flex flex-col gap-4">
              {rink.image && (
                <div className="rounded-xl overflow-hidden shadow-lg">
                  <img 
                    src={rink.image} 
                    alt={rink.name}
                    className="w-full h-48 lg:h-56 object-cover"
                  />
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-3">
                {rink.website && (
                   <Button asChild size="lg" className="shadow-sm">
                     <a href={rink.website} target="_blank" rel="noopener noreferrer">
                       Visit Website <ExternalLink className="ml-2 h-4 w-4" />
                     </a>
                   </Button>
                )}
                {rink.schedule_links.public_calendar_url && (
                  <Button asChild variant="outline" size="lg">
                    <a href={rink.schedule_links.public_calendar_url} target="_blank" rel="noopener noreferrer">
                      <Calendar className="mr-2 h-4 w-4" /> Public Schedule
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Quick Info / Description */}
            <section>
              <h2 className="font-serif text-2xl font-bold mb-4">About</h2>
              <p className="text-lg leading-relaxed text-muted-foreground">
                {rink.seo?.long_description ?? `Ice skating rink in ${rink.address.city}, ${rink.address.state}.`}
              </p>
              {(rink.seo?.what_to_know?.length ?? 0) > 0 && (
                <div className="mt-6 bg-blue-50 dark:bg-blue-950/20 p-6 rounded-xl border border-blue-100 dark:border-blue-900/50">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-3 flex items-center">
                    <Info className="h-4 w-4 mr-2" /> What to know before you go
                  </h3>
                  <ul className="space-y-2">
                    {rink.seo?.what_to_know?.map((item, i) => (
                      <li key={i} className="text-blue-800 dark:text-blue-300 text-sm flex items-start">
                        <span className="mr-2">•</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>

            {/* Offerings Grid */}
            <section>
              <h2 className="font-serif text-2xl font-bold mb-6">Offerings</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <OfferingItem label="Public Skating" available={rink.offerings.public_skating} icon={<Ticket className="h-4 w-4" />} />
                <OfferingItem label="Learn to Skate" available={rink.offerings.learn_to_skate} icon={<Snowflake className="h-4 w-4" />} />
                <OfferingItem label="Figure Skating" available={rink.offerings.figure_skating} icon={<Snowflake className="h-4 w-4" />} />
                <OfferingItem label="Hockey" available={rink.offerings.hockey} icon={<Dumbbell className="h-4 w-4" />} />
                <OfferingItem label="Open Hockey" available={rink.offerings.open_hockey} icon={<Dumbbell className="h-4 w-4" />} />
                <OfferingItem label="Stick & Puck" available={rink.offerings.stick_and_puck} icon={<Dumbbell className="h-4 w-4" />} />
              </div>
            </section>

            {/* Freestyle Section - SEO focus */}
            <section id="freestyle" className="scroll-mt-24">
               <div className="flex items-center gap-3 mb-6">
                 <h2 className="font-serif text-2xl font-bold">Freestyle Sessions</h2>
                 {typeof rink.freestyle.available === 'boolean' && rink.freestyle.available && (
                   <Badge className="bg-green-600">Available</Badge>
                 )}
               </div>
               
               <div className="bg-card border rounded-xl p-6 shadow-sm">
                 {rink.freestyle.available ? (
                   <div className="space-y-6">
                     <p className="text-muted-foreground">
                       This facility offers dedicated freestyle ice time for figure skaters.
                       {rink.freestyle.how_to_find_times && ` ${rink.freestyle.how_to_find_times}`}
                     </p>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium mb-2 text-foreground">Who it's for</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {rink.freestyle.who_its_for?.map(i => <li key={i}>• {i}</li>) || <li>Figure skaters</li>}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2 text-foreground">Etiquette & Tips</h4>
                           <ul className="text-sm text-muted-foreground space-y-1">
                            {rink.freestyle.etiquette_tips?.map(i => <li key={i}>• {i}</li>) || <li>Check in at front desk</li>}
                          </ul>
                        </div>
                     </div>
                   </div>
                 ) : (
                   <p className="text-muted-foreground">No specific freestyle sessions listed for this facility.</p>
                 )}
               </div>
            </section>

            {/* Rentals & Sharpening */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="font-serif text-2xl font-bold mb-4 flex items-center">
                  <Ticket className="h-5 w-5 mr-2" /> Rentals
                </h2>
                <div className="border rounded-lg p-5">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-medium">Skate Rental</span>
                    {rink.rentals.available ? (
                      <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Available</Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground">Not Available</Badge>
                    )}
                  </div>
                  {rink.rentals.available && (
                    <ul className="space-y-2 text-sm text-muted-foreground">
                       {rink.rentals.size_range_min && <li>Sizes: {rink.rentals.size_range_min} - {rink.rentals.size_range_max}</li>}
                       {rink.rentals.notes && <li>Note: {rink.rentals.notes}</li>}
                    </ul>
                  )}
                </div>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold mb-4 flex items-center">
                  <Scissors className="h-5 w-5 mr-2" /> Sharpening
                </h2>
                <div className="border rounded-lg p-5">
                  <div className="flex justify-between items-center mb-4">
                     <span className="font-medium">Pro Shop Service</span>
                     {rink.sharpening.available ? (
                      <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Available</Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground">Not Available</Badge>
                    )}
                  </div>
                  {rink.sharpening.available && (
                    <ul className="space-y-2 text-sm text-muted-foreground">
                       {rink.sharpening.pricing_base && <li>Base Price: {rink.sharpening.pricing_base}</li>}
                       {rink.sharpening.turnaround && <li>Turnaround: {rink.sharpening.turnaround}</li>}
                    </ul>
                  )}
                </div>
              </div>
            </section>

          </div>

          {/* Sidebar Info */}
          <div className="space-y-8">
             {/* Map Card */}
             <div className="bg-muted/20 rounded-xl p-6 border">
               <h3 className="font-bold mb-4">Location</h3>
               <address className="not-italic text-sm text-muted-foreground space-y-1 mb-4">
                 <p>{rink.address.street}</p>
                 <p>{rink.address.city}, {rink.address.state} {rink.address.postal_code}</p>
               </address>
               {rink.google_maps_url && (
                 <Button variant="outline" className="w-full" asChild>
                   <a href={rink.google_maps_url} target="_blank" rel="noopener noreferrer">
                     Get Directions
                   </a>
                 </Button>
               )}
             </div>

             {/* Facility Details */}
             <div className="bg-muted/20 rounded-xl p-6 border">
               <h3 className="font-bold mb-4">Facility Details</h3>
               <ul className="space-y-3 text-sm">
                 <li className="flex justify-between">
                   <span className="text-muted-foreground">Type</span>
                   <span className="font-medium">{rink.facility.indoor ? "Indoor" : "Outdoor"}</span>
                 </li>
                 <li className="flex justify-between">
                   <span className="text-muted-foreground">Season</span>
                   <span className="font-medium">{rink.facility.seasonality}</span>
                 </li>
                 <li className="flex justify-between">
                   <span className="text-muted-foreground">Sheets</span>
                   <span className="font-medium">{rink.facility.number_of_sheets || "Unknown"}</span>
                 </li>
               </ul>
             </div>

             {/* Verification */}
             <div className="text-xs text-muted-foreground">
               {rink.last_verified && <p>Last verified: {new Date(rink.last_verified).toLocaleDateString()}</p>}
               {rink.sources && rink.sources.length > 0 && <p>Source: {rink.sources.join(", ")}</p>}
             </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}

function OfferingItem({ label, available, icon }: { label: string, available: boolean, icon: React.ReactNode }) {
  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg border ${available ? 'bg-background border-border' : 'bg-muted/50 border-transparent opacity-60'}`}>
      <div className={`h-8 w-8 rounded-full flex items-center justify-center ${available ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
        {available ? icon : <X className="h-4 w-4" />}
      </div>
      <span className={`text-sm font-medium ${available ? 'text-foreground' : 'text-muted-foreground'}`}>{label}</span>
    </div>
  )
}
