import type { Rink } from "@/lib/data";

export const SITE_URL = "https://iceskatingindex.com";

export const STATE_NAMES: Record<string, string> = {
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

export function slugify(text: string) {
  return text.toLowerCase().replace(/\s+/g, "-");
}

export function canonicalUrl(path: string) {
  if (path === "/") return `${SITE_URL}/`;
  return `${SITE_URL}${path}`;
}

export function buildWebPageSchema(
  pagePath: string,
  name: string,
  description: string,
  type = "WebPage",
) {
  const url = canonicalUrl(pagePath);

  return {
    "@context": "https://schema.org",
    "@type": type,
    name,
    description,
    url,
    isPartOf: {
      "@type": "WebSite",
      name: "Ice Skating Index",
      url: `${SITE_URL}/`,
    },
  };
}

export function buildRinkItemList(rinks: Rink[], pagePath: string, name: string) {
  const operatingRinks = rinks.filter(rink =>
    rink.operating_status !== "closed" && rink.operating_status !== "coming_soon"
  );

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    url: canonicalUrl(pagePath),
    numberOfItems: operatingRinks.length,
    itemListElement: operatingRinks.map((rink, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${SITE_URL}/rink/${rink.slug}`,
      item: {
        "@type": ["LocalBusiness", "SportsActivityLocation"],
        name: rink.name,
        url: `${SITE_URL}/rink/${rink.slug}`,
        address: {
          "@type": "PostalAddress",
          streetAddress: rink.address.street,
          addressLocality: rink.address.city,
          addressRegion: rink.address.state,
          postalCode: rink.address.postal_code,
          addressCountry: "US",
        },
      },
    })),
  };
}
