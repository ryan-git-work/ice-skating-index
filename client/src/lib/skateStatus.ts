import statusData from "@/data/skate-status.json";

export type SkateStatusState = "normal" | "altered" | "closed";

export interface SkateStatusRecord {
  state: SkateStatusState;
  note: string;
  updated: string;
  verified_by: string | null;
  source_url: string;
}

const statuses = statusData as Record<string, SkateStatusRecord>;
const STALE_AFTER_DAYS = 10;

function parseDateOnly(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function getSkateStatus(slug: string, asOf = new Date()) {
  const status = statuses[slug];
  if (!status) return null;

  const updated = parseDateOnly(status.updated);
  const ageMs = asOf.getTime() - updated.getTime();
  const ageDays = Math.floor(ageMs / 86_400_000);

  return {
    ...status,
    isStale: ageDays > STALE_AFTER_DAYS,
  };
}

export function getLatestStatusUpdated(slugs?: string[]) {
  const allowed = slugs ? new Set(slugs) : null;
  const dates = Object.entries(statuses)
    .filter(([slug]) => !allowed || allowed.has(slug))
    .map(([, status]) => status.updated)
    .sort();

  return dates.at(-1);
}
