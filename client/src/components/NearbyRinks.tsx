import { Link } from "wouter";
import { MapPin, ArrowRight } from "lucide-react";

interface NearbyRink {
  slug: string;
  name: string;
  tagline: string;
}

interface NearbyRinksProps {
  title?: string;
  rinks: NearbyRink[];
  seeAllLink?: { href: string; label: string };
}

export function NearbyRinks({ title = "Other rinks nearby", rinks, seeAllLink }: NearbyRinksProps) {
  return (
    <div className="bg-muted/20 rounded-xl p-6 border">
      <h3 className="font-bold mb-4 flex items-center gap-2">
        <MapPin className="h-4 w-4 text-primary" />
        {title}
      </h3>
      <ul className="space-y-4">
        {rinks.map((rink) => (
          <li key={rink.slug}>
            <Link
              href={`/rink/${rink.slug}`}
              className="block group"
            >
              <div className="font-medium text-foreground group-hover:text-primary transition-colors flex items-center gap-1">
                {rink.name}
                <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-sm text-muted-foreground">{rink.tagline}</p>
            </Link>
          </li>
        ))}
      </ul>
      {seeAllLink && (
        <div className="mt-4 pt-4 border-t">
          <Link
            href={seeAllLink.href}
            className="text-sm text-primary hover:underline font-medium flex items-center gap-1"
          >
            {seeAllLink.label}
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      )}
    </div>
  );
}
