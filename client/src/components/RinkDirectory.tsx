import { ChevronDown, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RinkCard } from "@/components/RinkCard";
import type { Rink } from "@/lib/data";

// Native details keeps real listing anchors in prerendered HTML, even while
// collapsed, and supports keyboard disclosure before or without hydration.
export function RinkDirectory({ rinks, title }: { rinks: Rink[]; title: string }) {
  return (
    <details className="group/directory">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-lg bg-muted/50 p-4 hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary [&::-webkit-details-marker]:hidden">
        <span className="flex items-center gap-3">
          <MapPin className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
          <span className="font-semibold">{title}</span>
          <Badge variant="secondary">{rinks.length}</Badge>
        </span>
        <ChevronDown className="h-5 w-5 shrink-0 transition-transform group-open/directory:rotate-180" aria-hidden="true" />
      </summary>
      <div className="pt-6">
        <p className="mb-4 text-sm text-muted-foreground">These are rink directory entries, not live session or class inventory. Confirm current programs, eligibility and booking with the operator.</p>
        {rinks.length ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {rinks.map(rink => <RinkCard key={rink.id} rink={rink} />)}
          </div>
        ) : <p className="py-8 text-center text-muted-foreground">No matching directory entries. Check operators directly for current options.</p>}
      </div>
    </details>
  );
}
