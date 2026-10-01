import statusData from "@/data/skate-status.json";
import {
  evaluateSkateStatus,
  hasSkateStatusRecord,
  latestCurrentStatusUpdated,
  type SkateStatusEvaluation,
  type SkateStatusRecords,
} from "@/lib/skateStatus";

export const skateStatusRecords = statusData as SkateStatusRecords;

/**
 * Counts reads that could change rendered output, for the build only.
 *
 * script/prerender.ts uses this to record which routes actually consume academy
 * status, so the server knows the short list of pages worth re-rendering at
 * request time. It is read immediately after a synchronous renderToString call,
 * never across an await.
 */
let consumedStatusReads = 0;

export function resetSkateStatusConsumption() {
  consumedStatusReads = 0;
}

export function getSkateStatusConsumption() {
  return consumedStatusReads;
}

/** The evaluated advisory for a rink, or null when none is authored. */
export function getSkateStatus(slug: string, asOf: Date): SkateStatusEvaluation | null {
  if (hasSkateStatusRecord(skateStatusRecords, slug)) consumedStatusReads += 1;
  return evaluateSkateStatus(skateStatusRecords, slug, asOf);
}

/** The newest `updated` date among currently covered advisories in scope. */
export function getLatestCurrentStatusUpdated(
  slugs: string[] | undefined,
  asOf: Date,
): string | undefined {
  const inScope = slugs
    ? slugs.some((slug) => hasSkateStatusRecord(skateStatusRecords, slug))
    : Object.keys(skateStatusRecords).length > 0;
  if (inScope) consumedStatusReads += 1;
  return latestCurrentStatusUpdated(skateStatusRecords, slugs, asOf);
}
