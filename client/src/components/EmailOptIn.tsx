import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, CheckCircle } from "lucide-react";

interface EmailOptInProps {
  cityName?: string;
}

export function EmailOptIn({ cityName }: EmailOptInProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setStatus("submitting");

    try {
      const res = await fetch("/api/email-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, city: cityName || "your area", date: new Date().toISOString() }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const locationLabel = cityName || "your area";

  return (
    <div className="bg-primary/5 border rounded-lg p-6">
      <div className="flex items-start gap-3 mb-3">
        <Mail className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
        <div>
          <h3 className="font-semibold text-foreground">Get the Saturday Schedule</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Every Friday night, we email a verified list of public skate times for the weekend at every rink in{" "}
            {locationLabel}. Free.
          </p>
        </div>
      </div>

      {status === "success" ? (
        <div className="flex items-center gap-2 text-sm text-green-600">
          <CheckCircle className="h-4 w-4" />
          You&apos;re on the list. Check your inbox Friday night.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1"
            data-testid="email-optin-input"
          />
          <Button type="submit" disabled={status === "submitting"} className="shrink-0">
            {status === "submitting" ? "Sending..." : "Send me the schedule"}
          </Button>
        </form>
      )}

      {status === "error" && (
        <p className="text-sm text-red-500 mt-2">Something went wrong. Please try again.</p>
      )}
    </div>
  );
}
