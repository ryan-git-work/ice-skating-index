import { CalendarDays, ExternalLink, Sparkles } from "lucide-react";
import { PublicSkateSchedule } from "@/components/PublicSkateSchedule";
import { isTruthy, type Rink } from "@/lib/data";

function publicSummary(rink: Rink) {
  if (rink.slug === "centennial-sportsplex-nashville-tn") {
    return "Public skate is typically held on Rink A. Registration and the current session list now run through Predators DaySmart. Confirm the selected date before you go.";
  }
  return rink.pricing?.notes
    ?? `Public-skate times change. Open the official schedule and confirm the session before visiting ${rink.name}.`;
}

export function ScheduleLanes({ rink }: { rink: Rink }) {
  const publicUrl = rink.schedule_links.public_calendar_url;
  const freestyleUrl = rink.schedule_links.freestyle_calendar_url;
  const hasFreestyle = isTruthy(rink.freestyle.available) || Boolean(freestyleUrl);

  if (!publicUrl && !hasFreestyle) return null;

  return (
    <section id="public-skate-schedule" className="scroll-mt-24">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase text-primary">Choose your ice</p>
        <h2 className="mt-1 font-serif text-2xl font-bold">Public skate and practice ice</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Public skate is for casual skating and beginner practice. Freestyle is structured practice ice for figure skaters working on elements.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="border bg-card p-5">
          <div className="flex items-center gap-2 text-primary">
            <CalendarDays className="h-5 w-5" aria-hidden="true" />
            <h3 className="font-semibold text-foreground">Public skate</h3>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{publicSummary(rink)}</p>
          {publicUrl && (
            <div className="mt-5">
              <PublicSkateSchedule rinkName={rink.name} url={publicUrl} />
            </div>
          )}
        </div>

        {hasFreestyle && (
          <div className="border bg-card p-5">
            <div className="flex items-center gap-2 text-teal-700">
              <Sparkles className="h-5 w-5" aria-hidden="true" />
              <h3 className="font-semibold text-foreground">Freestyle and practice ice</h3>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {rink.freestyle.notes || rink.freestyle.how_to_find_times || "Confirm current practice-ice sessions and eligibility before registering."}
            </p>
            {(freestyleUrl || publicUrl) && (
              <a
                href={freestyleUrl || publicUrl || undefined}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex min-h-10 items-center gap-2 border border-primary/30 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/5"
              >
                View freestyle schedule
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
