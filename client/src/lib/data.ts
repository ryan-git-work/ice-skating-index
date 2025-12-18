import { z } from "zod";
import rinksData from "@/data/rinks.json";

export const RinkSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
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
    latitude: z.number(),
    longitude: z.number(),
  }).optional(),
  phone: z.string().optional(),
  email: z.string().nullable().optional(),
  website: z.string().optional(),
  google_maps_url: z.string().optional(),
  social_links: z.array(z.object({
    platform: z.string(),
    url: z.string(),
  })).optional(),
  place_ids: z.object({
    google_place_id: z.string().nullable().optional(),
    osm_id: z.string().nullable().optional(),
  }).optional(),
  facility: z.object({
    indoor: z.boolean(),
    seasonality: z.string(),
    number_of_sheets: z.number().optional(),
    sheet_sizes: z.array(z.string()).optional(),
  }),
  schedule_links: z.object({
    public_calendar_url: z.string().optional(),
    freestyle_calendar_url: z.string().nullable().optional(),
    hockey_calendar_url: z.string().optional(),
    lessons_url: z.string().optional(),
  }),
  offerings: z.object({
    public_skating: z.boolean(),
    learn_to_skate: z.boolean(),
    figure_skating: z.boolean(),
    hockey: z.boolean(),
    open_hockey: z.boolean(),
    stick_and_puck: z.boolean(),
  }),
  pricing: z.object({
    public_skate: z.union([
        z.string(),
        z.object({
            adult: z.number().optional(),
            youth: z.number().optional(),
            senior: z.number().optional(),
        })
    ]).optional(),
    spectators: z.number().optional(),
    notes: z.string().optional(),
  }).optional(),
  rentals: z.object({
    available: z.boolean(),
    included_with_admission: z.boolean().optional(),
    size_range_min: z.string().nullable().optional(),
    size_range_max: z.string().nullable().optional(),
    fit_tips: z.array(z.string()).optional(),
    recommendations: z.array(z.string()).optional(),
    notes: z.string().optional(),
  }),
  sharpening: z.object({
    available: z.boolean(),
    turnaround: z.string().optional(),
    pricing_base: z.union([z.string(), z.number()]).optional(),
    pricing_rush: z.union([z.string(), z.number()]).optional(),
    add_ons: z.array(z.union([
        z.string(),
        z.object({ name: z.string(), price: z.string() })
    ])).optional(),
    notes: z.string().optional(),
    info_url: z.string().optional(),
  }),
  freestyle: z.object({
    available: z.union([z.boolean(), z.literal("unknown")]),
    labels_to_search_for: z.array(z.string()).optional(),
    who_its_for: z.array(z.string()).optional(),
    how_to_find_times: z.string().optional(),
    cost_notes: z.string().nullable().optional(),
    etiquette_tips: z.array(z.string()).optional(),
    notes: z.string().optional(),
  }),
  amenities: z.object({
    lockers: z.union([z.boolean(), z.literal("unknown")]),
    spectator_seating: z.union([z.boolean(), z.literal("unknown")]),
    concessions: z.union([z.boolean(), z.literal("unknown")]),
    pro_shop: z.union([z.boolean(), z.literal("unknown")]),
    skate_aids: z.union([z.boolean(), z.literal("unknown")]).optional(),
  }),
  audiences: z.array(z.string()),
  tags: z.array(z.string()),
  faq: z.array(z.object({
    q: z.string(),
    a: z.string(),
  })).optional(),
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
  }),
  sources: z.array(z.string()),
  evidence: z.array(z.object({
      field: z.string(),
      url: z.string(),
      notes: z.string().optional()
  })).optional(),
  last_verified: z.string(),
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
