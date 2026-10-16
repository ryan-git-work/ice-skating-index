import { Link } from "wouter";
import { getRinkBySlug } from "@/lib/data";

// Read the same dated evidence as the rink pages, so this guide never carries
// an independent copy of a price. These are examples, not national averages.
export function RinkPriceExamples() {
  const examples = ["centennial-sportsplex-nashville-tn", "oakland-ice-center-oakland-ca"];
  return (
    <section className="mb-10 border bg-muted/20 p-5" aria-labelledby="price-examples-heading">
      <h2 id="price-examples-heading" className="font-serif text-2xl font-bold">Two dated rink price examples</h2>
      <p className="mt-2 text-sm text-muted-foreground">Rates depend on the rink and session. Confirm the selected booking total before paying.</p>
      <div className="mt-4 grid gap-5 sm:grid-cols-2">
        {examples.map((slug) => {
          const rink = getRinkBySlug(slug);
          const pricing = rink?.pricing;
          if (!rink || !pricing?.verified_on || !pricing.admission_tiers?.length) return null;
          const sources = Array.from(new Set(pricing.admission_tiers.map((tier) => tier.source_url).filter((source): source is string => Boolean(source))));
          return (
            <div key={slug}>
              <h3 className="font-semibold"><Link href={`/rink/${slug}`} className="text-primary underline">{rink.name}</Link></h3>
              <ul className="mt-2 space-y-1 text-sm">
                {pricing.admission_tiers.map((tier) => <li key={tier.label}>${tier.price} admission: {tier.label}</li>)}
              </ul>
              <p className="mt-2 text-sm">{pricing.price_basis}</p>
              <p className="mt-2 text-xs text-muted-foreground">Price source checked {pricing.verified_on}.</p>
              {sources.map((source) => <a key={source} href={source} className="mt-1 block text-sm text-primary underline" target="_blank" rel="noopener noreferrer">Official price and session listing</a>)}
            </div>
          );
        })}
      </div>
    </section>
  );
}
