import { useState, useEffect } from "react";
import { Clock, CalendarDays, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Session {
  date: string;
  time: string;
  price: string;
}

interface SessionsData {
  lastVerified: string;
  sessions: Session[];
}

interface NextPublicSkateSessionsProps {
  jsonPath: string;
  calendarUrl?: string;
  directionsUrl?: string;
  fallbackButton?: { label: string; href: string };
}

export function NextPublicSkateSessions({
  jsonPath,
  calendarUrl,
  directionsUrl,
  fallbackButton,
}: NextPublicSkateSessionsProps) {
  const [data, setData] = useState<SessionsData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(jsonPath)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((d: SessionsData) => setData(d))
      .catch(() => setError(true));
  }, [jsonPath]);

  if (error || !data || data.sessions.length === 0) {
    if (!fallbackButton) return null;
    return (
      <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
        <a href={fallbackButton.href} target="_blank" rel="noopener noreferrer">
          <CalendarDays className="mr-2 h-4 w-4" />
          {fallbackButton.label}
        </a>
      </Button>
    );
  }

  const formatDate = (iso: string) => {
    const d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  };

  return (
    <div className="bg-card border rounded-xl p-6 shadow-sm">
      <h3 className="font-serif text-xl font-bold mb-4 flex items-center gap-2">
        <Clock className="h-5 w-5 text-primary" />
        Next Public Skate Sessions
      </h3>

      <div className="space-y-3">
        {data.sessions.slice(0, 3).map((session, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border"
          >
            <div>
              <p className="font-medium text-foreground">{formatDate(session.date)}</p>
              <p className="text-sm text-muted-foreground">{session.time}</p>
            </div>
            <span className="text-sm font-medium text-primary">{session.price}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 mt-4">
        {calendarUrl && (
          <Button asChild variant="outline" size="sm">
            <a href={calendarUrl} target="_blank" rel="noopener noreferrer">
              <CalendarDays className="mr-2 h-4 w-4" />
              View full calendar
            </a>
          </Button>
        )}
        {directionsUrl && (
          <Button asChild variant="outline" size="sm">
            <a href={directionsUrl} target="_blank" rel="noopener noreferrer">
              <MapPin className="mr-2 h-4 w-4" />
              Get Directions
            </a>
          </Button>
        )}
      </div>

      <p className="text-xs text-muted-foreground mt-4">
        Schedules update weekly. Last verified {data.lastVerified}.
      </p>
    </div>
  );
}
