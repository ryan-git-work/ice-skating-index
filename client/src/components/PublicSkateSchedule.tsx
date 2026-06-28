import { CalendarDays, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PublicSkateScheduleProps {
  rinkName: string;
  url: string;
  embed?: boolean;
}

export function isGoogleCalendarEmbedUrl(url?: string | null) {
  return Boolean(url?.startsWith("https://calendar.google.com/calendar/embed"));
}

export function PublicSkateSchedule({
  rinkName,
  url,
  embed = false,
}: PublicSkateScheduleProps) {
  const isGoogleCalendar = isGoogleCalendarEmbedUrl(url);

  if (embed && isGoogleCalendar) {
    return (
      <section id="public-skate-schedule" className="scroll-mt-24">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-4">
          <div>
            <h2 className="font-serif text-2xl font-bold">Public Skate Schedule</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Public-skate schedule via {rinkName}. Open an event to confirm its details.
            </p>
          </div>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline inline-flex items-center gap-1"
          >
            Open calendar <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
        <div className="w-full overflow-hidden border bg-card">
          <iframe
            src={url}
            title={`${rinkName} public skate schedule`}
            loading="lazy"
            className="block w-full h-[560px] max-h-[70vh]"
          />
        </div>
      </section>
    );
  }

  return (
    <Button asChild variant="outline" size="lg">
      <a href={url} target="_blank" rel="noopener noreferrer">
        <CalendarDays className="mr-2 h-4 w-4" />
        {isGoogleCalendar ? "View public-skate calendar" : "View schedule & book"}
      </a>
    </Button>
  );
}
