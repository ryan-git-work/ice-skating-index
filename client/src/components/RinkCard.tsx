import { Link } from "wouter";
import { ArrowRight, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { isTruthy, type Rink } from "@/lib/data";
import { SkateStatusChip } from "@/components/SkateStatus";

interface RinkCardProps {
  rink: Rink;
}

export function RinkCard({ rink }: RinkCardProps) {
  const statusLabel = rink.operating_status === "closed"
    ? "Permanently Closed"
    : rink.operating_status === "coming_soon"
      ? "Coming Soon"
      : null;

  return (
    <Card className="group h-full flex flex-col overflow-hidden rounded-lg border bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
      <CardHeader className="p-0">
        <Link href={`/rink/${rink.slug}`} className="block">
        <div className="aspect-[16/9] bg-secondary relative overflow-hidden">
           {rink.image ? (
             <img 
               src={rink.image} 
               alt={rink.name}
               loading="lazy"
               className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.025]"
             />
           ) : (
             <div className="absolute inset-0 bg-secondary" />
           )}
           <div className="absolute left-3 top-3 right-3">
             <div className="flex flex-wrap gap-1.5">
               <SkateStatusChip slug={rink.slug} />
               {statusLabel && (
                 <Badge variant="secondary" className="rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-medium">
                   {statusLabel}
                 </Badge>
               )}
               {!statusLabel && isTruthy(rink.offerings.public_skating) && (
                 <Badge variant="secondary" className="rounded-full bg-white/95 text-xs font-medium text-slate-700 shadow-sm">
                   Public Skate
                 </Badge>
               )}
               {!statusLabel && isTruthy(rink.freestyle.available) && (
                 <Badge variant="secondary" className="rounded-full bg-white/95 text-xs font-medium text-slate-700 shadow-sm">
                   Freestyle
                 </Badge>
               )}
             </div>
           </div>
        </div>
        </Link>
      </CardHeader>
      <CardContent className="flex-1 p-5 space-y-3">
        <div>
          <h3 className="font-serif text-lg font-bold leading-snug group-hover:text-primary transition-colors">
            <Link href={`/rink/${rink.slug}`}>{rink.name}</Link>
          </h3>
          <div className="flex items-center text-sm text-muted-foreground mt-2">
            <MapPin className="h-3.5 w-3.5 mr-1" />
            <span>{rink.address.city}, {rink.address.state}</span>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2">
          {rink.seo?.short_description ?? `Ice skating rink in ${rink.address.city}, ${rink.address.state}.`}
        </p>
        <div className="flex flex-wrap gap-2 pt-1 text-xs text-slate-600">
          <span className="rounded-full bg-secondary px-2.5 py-1">
            {rink.facility.indoor === true ? "Indoor" : rink.facility.indoor === false ? "Outdoor" : "Facility details"}
          </span>
          <span className="rounded-full bg-secondary px-2.5 py-1 capitalize">
            {rink.facility.seasonality === "unknown" ? "Check season" : rink.facility.seasonality}
          </span>
        </div>
      </CardContent>
      <CardFooter className="p-5 pt-0 mt-auto">
        <Link
          href={`/rink/${rink.slug}`}
          className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-primary"
        >
          View rink details
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </CardFooter>
    </Card>
  );
}
