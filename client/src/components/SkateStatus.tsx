import {
  AlertTriangle,
  CheckCircle2,
  CircleX,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { formatVerifiedDate } from "@/components/LastVerified";
import { cn } from "@/lib/utils";
import { useAsOf } from "@/lib/asOf";
import { type SkateStatusState } from "@/lib/skateStatus";
import { getSkateStatus } from "@/lib/skateStatusData";

const stateStyles: Record<SkateStatusState, {
  label: string;
  heading: string;
  icon: typeof CheckCircle2;
  shell: string;
  iconShell: string;
  pill: string;
}> = {
  normal: {
    label: "Academy: regular",
    heading: "Academy ice: regular schedule",
    icon: CheckCircle2,
    shell: "border-emerald-200 bg-emerald-50/80",
    iconShell: "bg-emerald-100 text-emerald-700",
    pill: "border-emerald-200 bg-emerald-100 text-emerald-800",
  },
  altered: {
    label: "Academy: altered",
    heading: "Academy ice: schedule changes",
    icon: AlertTriangle,
    shell: "border-amber-200 bg-amber-50/80",
    iconShell: "bg-amber-100 text-amber-700",
    pill: "border-amber-200 bg-amber-100 text-amber-900",
  },
  closed: {
    label: "Academy: closed",
    heading: "Academy ice: closed for the listed dates",
    icon: CircleX,
    shell: "border-red-200 bg-red-50/80",
    iconShell: "bg-red-100 text-red-700",
    pill: "border-red-200 bg-red-100 text-red-800",
  },
};

/**
 * Renders nothing unless the advisory still covers today in Nashville. An
 * expired, malformed, or undated entry leaves no claim on the page at all.
 */
export function SkateStatus({ slug }: { slug: string }) {
  const asOf = useAsOf();
  const status = getSkateStatus(slug, asOf);
  if (!status || !status.isCurrent || !status.state) return null;

  const style = stateStyles[status.state];
  const Icon = style.icon;
  const heading = style.heading;
  const note = status.note;

  return (
    <section
      aria-labelledby={`skate-status-${slug}`}
      className={cn("border p-5 md:p-6", style.shell)}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className={cn(
            "grid h-10 w-10 flex-none place-items-center rounded-md",
            style.iconShell,
          )}>
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-muted-foreground">Academy ice status</p>
            <h2 id={`skate-status-${slug}`} className="mt-1 text-lg font-semibold text-foreground">
              {heading}
            </h2>
          </div>
        </div>
        <span className={cn(
          "whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold",
          style.pill,
        )}>
          {style.label}
        </span>
      </div>

      <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-700">{note}</p>

      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-current/10 pt-4 text-xs text-slate-600">
        {status.verifiedBy && (
          <span className="inline-flex items-center gap-1.5 font-medium text-teal-700">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            Verified by {status.verifiedBy}
          </span>
        )}
        <span>Updated {formatVerifiedDate(status.updated)}</span>
        {status.coveredFrom && status.coveredThrough && (
          <span>
            Covers {formatVerifiedDate(status.coveredFrom)} through{" "}
            {formatVerifiedDate(status.coveredThrough)}
          </span>
        )}
        <a
          href={status.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
        >
          View the official schedule
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}

export function SkateStatusChip({ slug }: { slug: string }) {
  const asOf = useAsOf();
  const status = getSkateStatus(slug, asOf);
  if (!status || !status.isCurrent || !status.state) return null;

  const style = stateStyles[status.state];
  const label = style.label;
  const dot = status.state === "normal"
    ? "bg-emerald-500"
    : status.state === "altered"
      ? "bg-amber-500"
      : "bg-red-500";

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border bg-white/95 px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-sm">
      <span className={cn("h-2 w-2 rounded-full", dot)} aria-hidden="true" />
      {label}
    </span>
  );
}
