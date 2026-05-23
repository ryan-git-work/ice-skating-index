import { useState } from "react";
import { Info } from "lucide-react";

interface LastVerifiedProps {
  date: string;
  showTooltip?: boolean;
}

export function LastVerified({ date, showTooltip = true }: LastVerifiedProps) {
  const [hovered, setHovered] = useState(false);

  const formatted = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      className="relative inline-block text-xs text-muted-foreground"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span className="flex items-center gap-1 cursor-help">
        <Info className="h-3 w-3" />
        Last verified: {formatted}
      </span>
      {showTooltip && hovered && (
        <div className="absolute bottom-full left-0 mb-2 w-72 rounded-lg border bg-popover p-3 text-xs text-popover-foreground shadow-lg z-50">
          Schedules and prices update frequently. If something has changed, email{" "}
          <a
            href="mailto:hello@iceskatingindex.com"
            className="font-medium underline hover:text-primary"
          >
            hello@iceskatingindex.com
          </a>{" "}
          and we&apos;ll fix it within 24 hours.
          <div className="absolute bottom-[-4px] left-4 h-2 w-2 rotate-45 border-b border-r bg-popover" />
        </div>
      )}
    </div>
  );
}
