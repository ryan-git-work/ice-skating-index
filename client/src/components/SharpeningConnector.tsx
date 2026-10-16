import { Mail, ShieldCheck } from "lucide-react";

export function SharpeningConnector({ compact = false }: { compact?: boolean }) {
  return (
    <aside className="border border-teal-200 bg-teal-50/70 p-5">
      <div className="flex items-start gap-3">
        <div className="grid h-9 w-9 flex-none place-items-center rounded-md bg-teal-100 text-teal-700">
          <ShieldCheck className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900">Have a sharpening question?</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            {compact
              ? "Include your location, blade type and the work you need. Confirm appointments and availability directly with the provider."
              : "You can send ISI a question about finding a sharpening service. Include your location, blade type and the work you need. Any private introduction depends on the provider's consent and availability; contact the provider directly to confirm an appointment."}
          </p>
          <a
            href="mailto:hello@iceskatingindex.com?subject=Help%20finding%20a%20skate%20sharpener"
            className="mt-4 inline-flex min-h-10 items-center gap-2 bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            Email a sharpening question
          </a>
          <p className="mt-3 text-xs text-teal-800">A message is not an appointment. Private contact details are not published.</p>
        </div>
      </div>
    </aside>
  );
}
