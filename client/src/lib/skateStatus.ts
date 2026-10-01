/**
 * Academy ice status evaluation.
 *
 * Every consumer (status card, chip, FAQ copy, FAQ/WebPage schema dates) reads
 * the same evaluated result so a notice cannot expire in one place and survive
 * in another. Expiry is driven by the record's explicit inclusive covered-date
 * range, read in America/Chicago, because the rinks are in Nashville and the
 * server, the build machine, and the reader's browser are not.
 *
 * This module intentionally has no imports: the record store lives in
 * ./skateStatusData so the logic stays testable from plain Node.
 */

export type SkateStatusState = "normal" | "altered" | "closed";

export const SKATE_STATUS_STATES: readonly SkateStatusState[] = ["normal", "altered", "closed"];

export const SKATE_STATUS_TIME_ZONE = "America/Chicago";

/** Supplemental freshness fallback. Expiry is the covered range; this only catches a forgotten entry. */
export const STALE_AFTER_DAYS = 10;

/** As authored in client/src/data/skate-status.json. Fields are validated, not trusted. */
export interface SkateStatusRecord {
  state: string;
  note: string;
  updated: string;
  covered_from?: string;
  covered_through?: string;
  verified_by?: string | null;
  source_url: string;
}

export type SkateStatusRecords = Record<string, SkateStatusRecord>;

export type SkateStatusNeutralReason =
  | "invalid-as-of"
  | "invalid-state"
  | "invalid-updated"
  | "future-updated"
  | "missing-coverage"
  | "invalid-coverage"
  | "future-coverage"
  | "expired-coverage"
  | "stale-age";

export interface SkateStatusEvaluation {
  slug: string;
  /** Null when the authored state is not one of the supported values. */
  state: SkateStatusState | null;
  note: string;
  updated: string;
  coveredFrom: string | null;
  coveredThrough: string | null;
  verifiedBy: string | null;
  sourceUrl: string;
  /** True only when the advisory still describes today in America/Chicago. */
  isCurrent: boolean;
  /** Why the advisory is being suppressed, or null when it is current. */
  neutralReason: SkateStatusNeutralReason | null;
  /** The Chicago calendar date the evaluation used, for debugging and tests. */
  asOfDate: string | null;
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

const chicagoDateFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: SKATE_STATUS_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

interface ZonedParts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
}

function chicagoParts(asOf: Date): ZonedParts | null {
  if (!(asOf instanceof Date) || Number.isNaN(asOf.getTime())) return null;
  const parts = chicagoDateFormatter.formatToParts(asOf);
  const read = (type: Intl.DateTimeFormatPartTypes) => {
    const value = parts.find((part) => part.type === type)?.value;
    return value === undefined ? NaN : Number(value);
  };
  const zoned = {
    year: read("year"),
    month: read("month"),
    day: read("day"),
    hour: read("hour") % 24,
    minute: read("minute"),
    second: read("second"),
  };
  return Object.values(zoned).some((value) => Number.isNaN(value)) ? null : zoned;
}

function pad(value: number, length = 2) {
  return String(value).padStart(length, "0");
}

/** The calendar date in Nashville for a given instant, as YYYY-MM-DD, or null if the instant is invalid. */
export function toChicagoDateString(asOf: Date): string | null {
  const parts = chicagoParts(asOf);
  if (!parts) return null;
  return `${pad(parts.year, 4)}-${pad(parts.month)}-${pad(parts.day)}`;
}

/** True only for a real calendar date written as YYYY-MM-DD. Rejects 2026-02-31 and "soon". */
export function isValidDateOnly(value: unknown): value is string {
  if (typeof value !== "string" || !ISO_DATE.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  if (month < 1 || month > 12 || day < 1 || day > 31) return false;
  const utc = new Date(Date.UTC(year, month - 1, day));
  return (
    utc.getUTCFullYear() === year && utc.getUTCMonth() === month - 1 && utc.getUTCDate() === day
  );
}

/** Whole days from `from` to `to`, both YYYY-MM-DD. Compared in UTC so no local parse is involved. */
export function daysBetweenDateOnly(from: string, to: string): number {
  const [fromYear, fromMonth, fromDay] = from.split("-").map(Number);
  const [toYear, toMonth, toDay] = to.split("-").map(Number);
  const fromMs = Date.UTC(fromYear, fromMonth - 1, fromDay);
  const toMs = Date.UTC(toYear, toMonth - 1, toDay);
  return Math.floor((toMs - fromMs) / 86_400_000);
}

/**
 * The zone offset in effect at an instant, as wall-clock minus UTC.
 *
 * Measured on a second-aligned instant because the formatter has no
 * sub-second resolution; the result is therefore an exact offset.
 */
function chicagoOffsetMs(instant: number): number | null {
  const aligned = Math.floor(instant / 1000) * 1000;
  const parts = chicagoParts(new Date(aligned));
  if (!parts) return null;
  const wallMs = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
  );
  return wallMs - aligned;
}

/**
 * The exact instant America/Chicago next rolls into a new calendar day.
 *
 * Solved rather than assumed: the zone offset on the far side of the boundary is
 * not today's offset, so the target wall time is re-projected with the offset
 * that actually applies there. Two refinements converge for a one-hour shift in
 * either direction, and US DST moves at 02:00 local, so a Chicago midnight is
 * never a skipped wall time.
 */
export function nextChicagoDayStart(asOf: Date): Date | null {
  const parts = chicagoParts(asOf);
  if (!parts) return null;

  const targetWallMs = Date.UTC(parts.year, parts.month - 1, parts.day + 1);
  const startOffset = chicagoOffsetMs(asOf.getTime());
  if (startOffset === null) return null;

  let instant = targetWallMs - startOffset;
  for (let refinement = 0; refinement < 3; refinement += 1) {
    const offset = chicagoOffsetMs(instant);
    if (offset === null) return null;
    const projected = targetWallMs - offset;
    if (projected === instant) break;
    instant = projected;
  }
  return new Date(instant);
}

/**
 * Milliseconds until the next America/Chicago midnight.
 *
 * Used by the client so a tab left open overnight re-evaluates. Deliberately
 * unclamped apart from a small positive settle: a floor measured in minutes
 * would keep an expired notice on screen past the moment it expired. If a timer
 * fires a hair early the caller simply reschedules the remaining milliseconds.
 */
export function msUntilNextChicagoDay(asOf: Date): number {
  const next = nextChicagoDayStart(asOf);
  if (!next) return 1_000;
  return Math.max(1, next.getTime() - asOf.getTime() + 250);
}

function neutral(
  slug: string,
  record: SkateStatusRecord,
  reason: SkateStatusNeutralReason,
  asOfDate: string | null,
): SkateStatusEvaluation {
  const state = SKATE_STATUS_STATES.includes(record.state as SkateStatusState)
    ? (record.state as SkateStatusState)
    : null;
  return {
    slug,
    state,
    note: typeof record.note === "string" ? record.note : "",
    updated: typeof record.updated === "string" ? record.updated : "",
    coveredFrom: isValidDateOnly(record.covered_from) ? record.covered_from : null,
    coveredThrough: isValidDateOnly(record.covered_through) ? record.covered_through : null,
    verifiedBy: record.verified_by ?? null,
    sourceUrl: typeof record.source_url === "string" ? record.source_url : "",
    isCurrent: false,
    neutralReason: reason,
    asOfDate,
  };
}

/**
 * Evaluate one authored record against an instant.
 *
 * Fails safe: anything missing, malformed, past its covered range, dated into
 * the future, or confirmed into the future evaluates neutral. A legacy record
 * with no covered dates is neutral rather than fresh for ten days, because the
 * ten-day age window was never an expiry for a dated note.
 */
export function evaluateSkateStatusRecord(
  slug: string,
  record: SkateStatusRecord | undefined | null,
  asOf: Date,
): SkateStatusEvaluation | null {
  if (!record || typeof record !== "object") return null;

  const asOfDate = toChicagoDateString(asOf);
  if (!asOfDate) return neutral(slug, record, "invalid-as-of", null);
  if (!SKATE_STATUS_STATES.includes(record.state as SkateStatusState)) {
    return neutral(slug, record, "invalid-state", asOfDate);
  }
  if (!isValidDateOnly(record.updated)) {
    return neutral(slug, record, "invalid-updated", asOfDate);
  }
  // A confirmation dated in the future was not made yet, whatever the coverage says.
  if (record.updated > asOfDate) {
    return neutral(slug, record, "future-updated", asOfDate);
  }
  if (record.covered_from == null || record.covered_through == null) {
    return neutral(slug, record, "missing-coverage", asOfDate);
  }
  if (!isValidDateOnly(record.covered_from) || !isValidDateOnly(record.covered_through)) {
    return neutral(slug, record, "invalid-coverage", asOfDate);
  }
  if (record.covered_from > record.covered_through) {
    return neutral(slug, record, "invalid-coverage", asOfDate);
  }
  // Inclusive range: the through-date is still current all day in Nashville.
  if (asOfDate > record.covered_through) {
    return neutral(slug, record, "expired-coverage", asOfDate);
  }
  if (asOfDate < record.covered_from) {
    return neutral(slug, record, "future-coverage", asOfDate);
  }
  if (daysBetweenDateOnly(record.updated, asOfDate) > STALE_AFTER_DAYS) {
    return neutral(slug, record, "stale-age", asOfDate);
  }

  return {
    slug,
    state: record.state as SkateStatusState,
    note: record.note,
    updated: record.updated,
    coveredFrom: record.covered_from,
    coveredThrough: record.covered_through,
    verifiedBy: record.verified_by ?? null,
    sourceUrl: record.source_url,
    isCurrent: true,
    neutralReason: null,
    asOfDate,
  };
}

/** Evaluate a slug against an explicit record store. Returns null when nothing is authored. */
export function evaluateSkateStatus(
  records: SkateStatusRecords,
  slug: string,
  asOf: Date,
): SkateStatusEvaluation | null {
  return evaluateSkateStatusRecord(slug, records[slug], asOf);
}

/**
 * The newest `updated` date among advisories that are current right now.
 *
 * Schema dates read from this, so an expired advisory stops advertising its
 * date instead of leaving a stale dateModified behind.
 */
export function latestCurrentStatusUpdated(
  records: SkateStatusRecords,
  slugs: string[] | undefined,
  asOf: Date,
): string | undefined {
  const allowed = slugs ? new Set(slugs) : null;
  return Object.keys(records)
    .filter((slug) => !allowed || allowed.has(slug))
    .map((slug) => evaluateSkateStatus(records, slug, asOf))
    .filter((status): status is SkateStatusEvaluation => Boolean(status?.isCurrent))
    .map((status) => status.updated)
    .sort()
    .at(-1);
}

/** True when a slug has an authored record at all, current or not. */
export function hasSkateStatusRecord(records: SkateStatusRecords, slug: string): boolean {
  return Object.prototype.hasOwnProperty.call(records, slug);
}
