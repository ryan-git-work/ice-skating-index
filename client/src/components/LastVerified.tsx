import { Info } from "lucide-react";

interface LastVerifiedProps {
  date: string;
  showTooltip?: boolean;
}

export function formatVerifiedDate(date: string, options?: Intl.DateTimeFormatOptions) {
  const [year, month, day] = date.split("-").map(Number);
  const parsed = year && month && day
    ? new Date(year, month - 1, day)
    : new Date(date);

  return parsed.toLocaleDateString("en-US", options);
}

export function LastVerified({ date, showTooltip = true }: LastVerifiedProps) {
  const formatted = formatVerifiedDate(date, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const dateLabel = <span className="inline-flex items-center gap-1"><Info className="h-3 w-3" aria-hidden="true" />Last verified: {formatted}</span>;
  if (!showTooltip) return <span className="text-xs text-muted-foreground">{dateLabel}</span>;

  return (
    <details className="max-w-sm text-xs text-muted-foreground">
      <summary className="cursor-pointer rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
        {dateLabel} <span className="underline">Correction information</span>
      </summary>
      <div className="mt-2 rounded-lg border bg-popover p-3 text-popover-foreground">
        Schedules and prices can change. Confirm current details with the rink before traveling.
        To report a possible correction, email{" "}
        <a href="mailto:hello@iceskatingindex.com" className="font-medium underline hover:text-primary">
          hello@iceskatingindex.com
        </a>.
      </div>
    </details>
  );
}
