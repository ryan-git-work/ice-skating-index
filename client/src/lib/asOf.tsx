import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { msUntilNextChicagoDay } from "@/lib/skateStatus";

/**
 * The single "as of" instant a render is evaluated against.
 *
 * The server passes one request-time snapshot so every component on the page
 * agrees, instead of each call site reading the clock. In the browser there is
 * no snapshot: the provider holds the current time in state and refreshes it at
 * the next Nashville midnight, so a tab left open overnight drops an advisory
 * that has run out and updates the FAQ schema with it.
 */
const AsOfContext = createContext<Date | null>(null);

export function AsOfProvider({ asOf, children }: { asOf?: Date; children: ReactNode }) {
  const [clockAsOf, setClockAsOf] = useState<Date>(() => asOf ?? new Date());

  useEffect(() => {
    // A supplied snapshot is fixed for the life of the render (SSR and tests).
    if (asOf) return;
    if (typeof window === "undefined") return;

    let timer: ReturnType<typeof setTimeout>;
    const schedule = (from: Date) => {
      timer = setTimeout(() => {
        const now = new Date();
        setClockAsOf(now);
        schedule(now);
      }, msUntilNextChicagoDay(from));
    };
    schedule(new Date());
    return () => clearTimeout(timer);
  }, [asOf]);

  return <AsOfContext.Provider value={asOf ?? clockAsOf}>{children}</AsOfContext.Provider>;
}

/** The current render's as-of instant. Falls back to the clock outside a provider. */
export function useAsOf(): Date {
  return useContext(AsOfContext) ?? new Date();
}
