import { z } from "zod";
import rinksData from "@/data/rinks.json";

export const RinkSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  image: z.string().nullable().optional(),
  alternate_names: z.array(z.string()).optional(),
  category: z.string().optional(),
  operator: z.string().nullable().optional(),
  address: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    postal_code: z.string(),
    country: z.string(),
  }),
  geo: z.object({
    latitude: z.number().nullable(),
    longitude: z.number().nullable(),
  }).optional(),
  phone: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  website: z.string().nullable().optional(),
  google_maps_url: z.string().nullable().optional(),
  social_links: z.array(z.object({
    platform: z.string(),
    url: z.string(),
  })).optional(),
  place_ids: z.object({
    google_place_id: z.string().nullable().optional(),
    osm_id: z.string().nullable().optional(),
  }).optional(),
  facility: z.object({
    indoor: z.union([z.boolean(), z.literal("unknown")]),
    seasonality: z.string(),
    number_of_sheets: z.number().nullable().optional(),
    sheet_sizes: z.array(z.string()).optional(),
  }),
  schedule_links: z.object({
    public_calendar_url: z.string().nullable().optional(),
    freestyle_calendar_url: z.string().nullable().optional(),
    hockey_calendar_url: z.string().nullable().optional(),
    lessons_url: z.string().nullable().optional(),
  }),
  offerings: z.object({
    public_skating: z.union([z.boolean(), z.literal("true"), z.literal("false"), z.literal("unknown")]),
    learn_to_skate: z.union([z.boolean(), z.literal("true"), z.literal("false"), z.literal("unknown")]),
    figure_skating: z.union([z.boolean(), z.literal("true"), z.literal("false"), z.literal("unknown")]),
    hockey: z.union([z.boolean(), z.literal("true"), z.literal("false"), z.literal("unknown")]),
    open_hockey: z.union([z.boolean(), z.literal("true"), z.literal("false"), z.literal("unknown")]),
    stick_and_puck: z.union([z.boolean(), z.literal("true"), z.literal("false"), z.literal("unknown")]),
  }),
  pricing: z.object({
    public_skate: z.union([
        z.string(),
        z.object({
            adult: z.number().nullable().optional(),
            youth: z.number().nullable().optional(),
            child: z.number().nullable().optional(),
            senior: z.number().nullable().optional(),
        })
    ]).optional(),
    spectators: z.number().nullable().optional(),
    notes: z.string().optional(),
  }).optional(),
  rentals: z.object({
    available: z.union([z.boolean(), z.literal("true"), z.literal("false"), z.literal("unknown")]),
    included_with_admission: z.union([z.boolean(), z.literal("true"), z.literal("false"), z.literal("unknown")]).optional(),
    size_range_min: z.string().nullable().optional(),
    size_range_max: z.string().nullable().optional(),
    fit_tips: z.array(z.string()).optional(),
    recommendations: z.array(z.string()).optional(),
    notes: z.string().optional(),
  }),
  sharpening: z.object({
    available: z.union([z.boolean(), z.literal("true"), z.literal("false"), z.literal("unknown")]).optional(),
    turnaround: z.string().nullable().optional(),
    pricing_base: z.union([z.string(), z.number()]).nullable().optional(),
    pricing_rush: z.union([z.string(), z.number()]).nullable().optional(),
    add_ons: z.array(z.union([
        z.string(),
        z.object({ name: z.string(), price: z.string() })
    ])).optional(),
    notes: z.string().nullable().optional(),
    info_url: z.string().nullable().optional(),
  }),
  freestyle: z.object({
    available: z.union([z.boolean(), z.literal("true"), z.literal("false"), z.literal("unknown")]),
    labels_to_search_for: z.array(z.string()).optional(),
    who_its_for: z.array(z.string()).optional(),
    how_to_find_times: z.string().nullable().optional(),
    cost_notes: z.string().nullable().optional(),
    etiquette_tips: z.array(z.string()).optional(),
    notes: z.string().nullable().optional(),
  }),
  amenities: z.object({
    lockers: z.union([z.boolean(), z.literal("true"), z.literal("false"), z.literal("unknown")]),
    spectator_seating: z.union([z.boolean(), z.literal("true"), z.literal("false"), z.literal("unknown")]),
    concessions: z.union([z.boolean(), z.literal("true"), z.literal("false"), z.literal("unknown")]),
    pro_shop: z.union([z.boolean(), z.literal("true"), z.literal("false"), z.literal("unknown")]),
    skate_aids: z.union([z.boolean(), z.literal("true"), z.literal("false"), z.literal("unknown")]).optional(),
  }),
  audiences: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  seasonal: z.boolean().optional(),
  seasonal_notes: z.string().optional(),
  subheader: z.string().optional(),
  nearby_rinks: z.array(z.object({
    slug: z.string(),
    name: z.string(),
    tagline: z.string(),
  })).optional(),
  description: z.string().optional(),
  what_to_know: z.array(z.string()).optional(),
  faq: z.array(z.union([
    z.object({ q: z.string(), a: z.string() }),
    z.object({ question: z.string(), answer: z.string() }),
  ])).optional(),
  seo: z.object({
    primary_keywords: z.array(z.string()),
    secondary_keywords: z.array(z.string()),
    short_description: z.string(),
    long_description: z.string(),
    helpful_blurbs: z.array(z.string()),
    what_to_know: z.array(z.string()),
    intent_groups: z.record(z.array(z.string())).optional(),
    meta_title: z.string().optional(),
    meta_description: z.string().optional(),
    snippet: z.string().optional(),
  }).optional(),
  sources: z.array(z.string()).optional(),
  evidence: z.array(z.object({
      field: z.string(),
      url: z.string(),
      note: z.string().optional(),
      notes: z.string().optional()
  })).optional(),
  last_verified: z.string().optional(),
});

export type Rink = z.infer<typeof RinkSchema>;

// Validate data on load
const parsedRinks = z.array(RinkSchema).safeParse(rinksData);

if (!parsedRinks.success) {
  console.error("Data validation failed:", parsedRinks.error);
}

export const rinks: Rink[] = parsedRinks.success ? parsedRinks.data : [];

// Helpers
export function getRinkBySlug(slug: string) {
  return rinks.find((r) => r.slug === slug);
}

export function getRinksByState(state: string) {
  return rinks.filter((r) => r.address.state.toLowerCase() === state.toLowerCase());
}

export function getRinksByCity(state: string, city: string) {
  return rinks.filter(
    (r) =>
      r.address.state.toLowerCase() === state.toLowerCase() &&
      r.address.city.toLowerCase() === city.toLowerCase()
  );
}

export function getAllStates() {
  const states = new Set(rinks.map((r) => r.address.state));
  return Array.from(states).sort();
}

export function getAllCities(state: string) {
  const cities = new Set(
    rinks
      .filter((r) => r.address.state.toLowerCase() === state.toLowerCase())
      .map((r) => r.address.city)
  );
  return Array.from(cities).sort();
}

// Helper to check if a flexible boolean value is truthy
export function isTruthy(value: boolean | string | undefined): boolean {
  return value === true || value === "true";
}

// Helper to check if a value is unknown
export function isUnknown(value: boolean | string | undefined): boolean {
  return value === "unknown";
}

// Get rinks with freestyle available
export function getFreestyleRinks() {
  return rinks.filter((r) => isTruthy(r.freestyle.available));
}

// Get nearby rinks in the same city (excluding the given rink)
export function getNearbyRinks(currentRink: Rink, limit = 4): Rink[] {
  return rinks
    .filter(
      (r) =>
        r.id !== currentRink.id &&
        r.address.city.toLowerCase() === currentRink.address.city.toLowerCase() &&
        r.address.state.toLowerCase() === currentRink.address.state.toLowerCase()
    )
    .slice(0, limit);
}
