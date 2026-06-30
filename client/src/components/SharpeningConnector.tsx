import { Mail, ShieldCheck } from "lucide-react";

export function SharpeningConnector({ compact = false }: { compact?: boolean }) {
  return (
    <aside className="border border-teal-200 bg-teal-50/70 p-5">
      <div className="flex items-start gap-3">
        <div className="grid h-9 w-9 flex-none place-items-center rounded-md bg-teal-100 text-teal-700">
          <ShieldCheck className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900">We can connect you with the right sharpener</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            {compact
              ? "Have figure blades, a tricky repair, or want a second opinion? Reach out and we will point you toward the right public option or help make a private connection."
              : "Not sure where to get your skates sharpened? If you have figure blades, a tricky repair, or just want a second opinion, reach out and we will point you to the right person. We protect private sharpeners' contact information and make introductions individually."}
          </p>
          <a
            href="mailto:hello@iceskatingindex.com?subject=Help%20finding%20a%20skate%20sharpener"
            className="mt-4 inline-flex min-h-10 items-center gap-2 bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            Ask for a sharpening connection
          </a>
          <p className="mt-3 text-xs text-teal-800">Verified by a local coach. Updated June 27, 2026.</p>
        </div>
      </div>
    </aside>
  );
}
