import { Layout } from "@/components/Layout";
import { rinks, getRinkBySlug } from "@/lib/data";
import { Link, useParams } from "wouter";
import NotFound from "@/pages/not-found";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  MapPin, Phone, Calendar,
  Info, X, ExternalLink, Ticket,
  Snowflake, Dumbbell, Scissors, ChevronDown, ChevronUp
} from "lucide-react";
import { useHead } from "@/hooks/use-head";
import { useState, useEffect } from "react";

const SITE_URL = "https://iceskatingindex.com";

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

function slugify(text: string) {
  return text.toLowerCase().replace(/\s+/g, "-");
}

function getFaqQA(item: { q?: string; a?: string; question?: string; answer?: string }): { q: string; a: string } {
  if ("question" in item && item.question) return { q: item.question, a: item.answer ?? "" };
  return { q: item.q ?? "", a: item.a ?? "" };
}

function stripFirstParagraph(content?: string) {
  return content?.split("\n\n")[0] ?? "";
}

function upsertJsonLd(id: string, value: unknown) {
  const existing = document.getElementById(id);
  if (existing) existing.remove();
  const script = document.createElement("script");
  script.id = id;
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(value);
  document.head.appendChild(script);
}

function formatOfferingName(key: string) {
  return key.replace(/_/g, " ");
}

function buildOfferingList(rink: NonNullable<ReturnType<typeof getRinkBySlug>>) {
  const map: Array<[string, boolean | string | undefined]> = [
    ["public skating", rink.offerings.public_skating],
    ["learn-to-skate programs", rink.offerings.learn_to_skate],
    ["figure skating", rink.offerings.figure_skating],
    ["hockey", rink.offerings.hockey],
    ["open hockey", rink.offerings.open_hockey],
    ["stick and puck", rink.offerings.stick_and_puck],
  ];
  return map.filter(([, value]) => value === true || value === "true").slice(0, 3).map(([name]) => name);
}

export default function RinkDetail() {
  const params = useParams();
  const rink = getRinkBySlug(params.slug || "");

  const description = rink?.description ?? rink?.seo?.long_description;
  const whatToKnow = rink?.what_to_know ?? rink?.seo?.what_to_know;
  const faqItems = rink?.faq ?? [];

  const faqSchema = faqItems.length > 0 ? JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map(item => {
      const { q, a } = getFaqQA(item as any);
      return {
        "@type": "Question",
        "name": q,
        "acceptedAnswer": { "@type": "Answer", "text": a }
      };
    })
  }) : null;

  useHead({
    title: rink ? rink.name : "Rink Not Found",
    description: rink
      ? `${rink.name} in ${rink.address.city}, ${rink.address.state} offers ${buildOfferingList(rink).join(", ")}. Find schedules, pricing, and directions at Ice Skating Index.`
      : undefined,
  });

  useEffect(() => {
    if (!faqSchema) return;
    const existing = document.getElementById("faq-schema");
    if (existing) existing.remove();
    const script = document.createElement("script");
    script.id = "faq-schema";
    script.type = "application/ld+json";
    script.textContent = faqSchema;
    document.head.appendChild(script);
    return () => { document.getElementById("faq-schema")?.remove(); };
  }, [faqSchema]);

  useEffect(() => {
    if (!rink) return;
    const schema: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": ["LocalBusiness", "SportsActivityLocation"],
      name: rink.name,
      description: stripFirstParagraph(description),
      address: {
        "@type": "PostalAddress",
        streetAddress: rink.address.street,
        addressLocality: rink.address.city,
        addressRegion: rink.address.state,
        postalCode: rink.address.postal_code,
        addressCountry: "US",
      },
      url: `${SITE_URL}/rink/${rink.slug}`,
      sport: "Ice Skating",
    };

    if (rink.phone) {
      schema.telephone = rink.phone;
    }
    if (rink.geo?.latitude != null && rink.geo?.longitude != null) {
      schema.geo = {
        "@type": "GeoCoordinates",
        latitude: rink.geo.latitude,
        longitude: rink.geo.longitude,
      };
    }

    upsertJsonLd("rink-schema", schema);
    return () => {
      document.getElementById("rink-schema")?.remove();
    };
  }, [rink, description]);

  useEffect(() => {
    if (!rink) return;
    const stateSlug = slugify(rink.address.state);
    const stateName = STATE_NAMES[stateSlug] || rink.address.state;
    const citySlug = slugify(rink.address.city);

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: SITE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: stateName,
          item: `${SITE_URL}/state/${stateSlug}`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: rink.address.city,
          item: `${SITE_URL}/city/${stateSlug}/${citySlug}`,
        },
        {
          "@type": "ListItem",
          position: 4,
          name: rink.name,
          item: `${SITE_URL}/rink/${rink.slug}`,
        },
      ],
    };

    upsertJsonLd("breadcrumb-schema", breadcrumbSchema);
    return () => {
      document.getElementById("breadcrumb-schema")?.remove();
    };
  }, [rink]);

  if (!rink) {
    return <NotFound />;
  }

  return (
    <Layout>
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-4 text-sm text-muted-foreground flex items-center gap-2">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link href={`/state/${slugify(rink.address.state)}`} className="hover:text-primary">
            {STATE_NAMES[slugify(rink.address.state)] || rink.address.state}
          </Link>
          <span>/</span>
          <Link href={`/city/${slugify(rink.address.state)}/${slugify(rink.address.city)}`} className="hover:text-primary">
            {rink.address.city}
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">{rink.name}</span>
        </div>
      </div>

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
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="font-serif text-2xl font-bold mb-4">About</h2>
              {description ? (
                <div className="space-y-4">
                  {description.split("\n\n").map((para, i) => (
                    <p key={i} className="text-base leading-relaxed text-muted-foreground">{para}</p>
                  ))}
                </div>
              ) : (
                <p className="text-base leading-relaxed text-muted-foreground">
                  Ice skating rink in {rink.address.city}, {rink.address.state}.
                </p>
              )}

              {(whatToKnow?.length ?? 0) > 0 && (
                <div className="mt-6 bg-blue-50 dark:bg-blue-950/20 p-6 rounded-xl border border-blue-100 dark:border-blue-900/50">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-3 flex items-center">
                    <Info className="h-4 w-4 mr-2" /> What to know before you go
                  </h3>
                  <ul className="space-y-2">
                    {whatToKnow?.map((item, i) => (
                      <li key={i} className="text-blue-800 dark:text-blue-300 text-sm flex items-start">
                        <span className="mr-2 mt-0.5 flex-shrink-0">•</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>

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

            {faqItems.length > 0 && (
              <section>
                <h2 className="font-serif text-2xl font-bold mb-6">Frequently Asked Questions</h2>
                <div className="space-y-3">
                  {faqItems.map((item, i) => {
                    const { q, a } = getFaqQA(item as any);
                    return <FaqItem key={i} question={q} answer={a} />;
                  })}
                </div>
              </section>
            )}
          </div>

          <div className="space-y-8">
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

function OfferingItem({ label, available, icon }: { label: string, available: boolean | string | undefined, icon: React.ReactNode }) {
  const isAvailable = available === true || available === "true";
  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg border ${isAvailable ? 'bg-background border-border' : 'bg-muted/50 border-transparent opacity-60'}`}>
      <div className={`h-8 w-8 rounded-full flex items-center justify-center ${isAvailable ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
        {isAvailable ? icon : <X className="h-4 w-4" />}
      </div>
      <span className={`text-sm font-medium ${isAvailable ? 'text-foreground' : 'text-muted-foreground'}`}>{label}</span>
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border rounded-lg overflow-hidden">
      <button
        data-testid={`faq-toggle-${question.slice(0, 20).replace(/\s+/g, '-').toLowerCase()}`}
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left font-medium hover:bg-muted/40 transition-colors"
        aria-expanded={open}
      >
        <span>{question}</span>
        {open ? <ChevronUp className="h-4 w-4 flex-shrink-0 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 flex-shrink-0 text-muted-foreground" />}
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed border-t bg-muted/10">
          <p className="pt-3">{answer}</p>
        </div>
      )}
    </div>
  );
}
