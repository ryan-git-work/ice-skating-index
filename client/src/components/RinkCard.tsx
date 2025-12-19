import { Link } from "wouter";
import { MapPin, Calendar, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { isTruthy, type Rink } from "@/lib/data";

interface RinkCardProps {
  rink: Rink;
}

export function RinkCard({ rink }: RinkCardProps) {
  return (
    <Card className="group h-full flex flex-col overflow-hidden border transition-all hover:shadow-md hover:border-primary/20">
      <CardHeader className="p-0">
        <div className="h-40 bg-secondary/50 relative overflow-hidden">
           {rink.image ? (
             <img 
               src={rink.image} 
               alt={rink.name}
               className="absolute inset-0 w-full h-full object-cover"
             />
           ) : (
             <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10" />
           )}
           <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
           <div className="absolute bottom-3 left-3 right-3">
             <div className="flex flex-wrap gap-1.5">
               {isTruthy(rink.offerings.public_skating) && (
                 <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-xs font-normal">
                   Public Skate
                 </Badge>
               )}
               {isTruthy(rink.freestyle.available) && (
                 <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-xs font-normal">
                   Freestyle
                 </Badge>
               )}
             </div>
           </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-5 space-y-3">
        <div>
          <h3 className="font-serif text-xl font-bold leading-tight group-hover:text-primary transition-colors">
            <Link href={`/rink/${rink.slug}`}>{rink.name}</Link>
          </h3>
          <div className="flex items-center text-sm text-muted-foreground mt-2">
            <MapPin className="h-3.5 w-3.5 mr-1" />
            <span>{rink.address.city}, {rink.address.state}</span>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2">
          {rink.seo.short_description}
        </p>
      </CardContent>
      <CardFooter className="p-5 pt-0 mt-auto border-t bg-muted/10">
        <div className="w-full flex items-center justify-between pt-4">
            <Link href={`/rink/${rink.slug}`}>
              <Button variant="outline" size="sm" className="w-full group-hover:border-primary/50 group-hover:text-primary">
                View Details
              </Button>
            </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
