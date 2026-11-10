import { Fragment } from "react";
import { HOLIDAY_COMPARISON } from "@/lib/holidayDiscovery";

type Item = { name: string; href: string; text: string };
type Block = { heading_h2: string; intro: string; items: Item[]; links: {label: string; href?: string; href_key?: string}[]; check_label: string };

// The small author-supplied link syntax accepts only local destinations.
export function DiscoveryText({ text }: { text: string }) {
  const parts = text.replaceAll("{holiday_comparison}", HOLIDAY_COMPARISON).split(/(\[[^\]]+\]\([^\)]+\))/g);
  return <>{parts.map((part, i) => {
    const link = part.match(/^\[([^\]]+)\]\(([^\)]+)\)$/);
    if (!link || !/^\/(?!\/)|^#/.test(link[2])) return <Fragment key={i}>{part}</Fragment>;
    return <a key={i} href={link[2]} className="font-medium text-primary underline underline-offset-4">{link[1]}</a>;
  })}</>;
}

export function HolidayDiscovery({ block }: { block: Block }) {
  return <section id="holiday-rinks" aria-labelledby="holiday-rinks-heading" className="rounded-lg border bg-card p-6 sm:p-8">
    <h2 id="holiday-rinks-heading" className="font-serif text-2xl font-bold mb-4">{block.heading_h2}</h2>
    <p className="max-w-3xl text-muted-foreground leading-relaxed mb-6">{block.intro}</p>
    <dl className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
      {block.items.map(item => <div key={item.href}>
        <dt className="font-semibold mb-2"><a href={item.href} className="text-primary underline underline-offset-4">{item.name}</a></dt>
        <dd className="text-sm text-muted-foreground leading-relaxed">{item.text}</dd>
      </div>)}
    </dl>
    <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
      {block.links.map(link => <a key={link.label} href={link.href_key === "holiday_comparison" ? HOLIDAY_COMPARISON : link.href!} className="text-sm font-semibold text-primary underline underline-offset-4">{link.label}</a>)}
    </div>
    <p className="mt-5 text-xs text-muted-foreground">{block.check_label}</p>
  </section>;
}
