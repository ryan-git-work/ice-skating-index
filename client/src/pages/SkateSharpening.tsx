import { Layout } from "@/components/Layout";
import { useHead } from "@/hooks/use-head";
import { rinks, isTruthy } from "@/lib/data";
import { RinkCard } from "@/components/RinkCard";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, Sparkles, AlertCircle, HelpCircle, MapPin } from "lucide-react";
import { useState } from "react";
import { buildWebPageSchema } from "@/lib/seo";
import { SharpeningConnector } from "@/components/SharpeningConnector";

export default function SkateSharpening() {
  const description = "Learn how skate sharpening works, what to ask for, and how to find quality sharpening near you. A practical guide for figure skaters and hockey players.";

  useHead({
    title: "Skate Sharpening Guide",
    description,
    canonicalPath: "/services/skate-sharpening",
    structuredData: [buildWebPageSchema("/services/skate-sharpening", "Skate Sharpening Guide", description)],
  });

  const [showRinks, setShowRinks] = useState(false);
  
  const rinksWithSharpening = rinks.filter(r => isTruthy(r.sharpening.available));

  const sections = [
    { id: "simple-idea", label: "The simple idea" },
    { id: "figure-vs-hockey", label: "Figure skates vs hockey skates" },
    { id: "roh", label: "What ROH means" },
    { id: "how-often", label: "How often should you sharpen" },
    { id: "signs-need", label: "Signs you might need a sharpening" },
    { id: "signs-poor", label: "Signs of a poor sharpening" },
    { id: "what-to-ask", label: "What to ask before you sharpen" },
    { id: "find-sharpening", label: "How to find sharpening near you" },
  ];

  return (
    <Layout>
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Skate Sharpening</h1>
          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
            Skate sharpening can make skating feel smooth and confident, or frustrating and unstable. 
            The tricky part is that sharpening quality varies widely by rink, pro shop, and technician. 
            This page is here to help you understand the basics, know what to ask for, and make smarter 
            choices before you hand your skates over.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Table of Contents - Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="sticky top-8">
              <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-4">On this page</h2>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <a 
                    key={section.id}
                    href={`#${section.id}`}
                    className="block text-sm text-muted-foreground hover:text-primary transition-colors py-1"
                  >
                    {section.label}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 max-w-3xl space-y-12">
            <SharpeningConnector />
            
            {/* The Simple Idea */}
            <section id="simple-idea">
              <h2 className="font-serif text-2xl font-bold mb-4">The simple idea</h2>
              <p className="text-muted-foreground leading-relaxed">
                Sharpening creates two edges on the bottom of your blade with a shallow groove between them. 
                That groove is what gives you bite and control. Too much bite can feel grabby and exhausting. 
                Too little bite can feel slippery and unpredictable.
              </p>
            </section>

            <Separator />

            {/* Figure vs Hockey */}
            <section id="figure-vs-hockey">
              <h2 className="font-serif text-2xl font-bold mb-4">Figure skates vs hockey skates</h2>
              <p className="text-muted-foreground leading-relaxed">
                Figure skates often benefit from a slightly less aggressive feel because many skaters want 
                clean gliding, controlled turns, and stable landings without feeling stuck to the ice. 
                Hockey skates often use a deeper groove because quick stops, tight turns, and acceleration 
                demand more bite.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                There is no universal rule. Your weight, skill level, and skating style matter as much as the sport.
              </p>
            </section>

            <Separator />

            {/* ROH */}
            <section id="roh">
              <h2 className="font-serif text-2xl font-bold mb-4">What "ROH" means</h2>
              <p className="text-muted-foreground leading-relaxed">
                You may hear people talk about "ROH," which stands for "radius of hollow." This is the depth 
                of the groove that is cut into your blade. A smaller number usually means more bite. A larger 
                number usually means more glide.
              </p>
              <div className="mt-6 bg-blue-50 dark:bg-blue-950/20 p-6 rounded-xl border border-blue-100 dark:border-blue-900/50">
                <p className="text-blue-800 dark:text-blue-300 text-sm">
                  <strong>Tip:</strong> If you are new, the goal is not perfection. The goal is consistency. 
                  Pick a reasonable starting point and stay with it long enough to learn what you actually like.
                </p>
              </div>
            </section>

            <Separator />

            {/* How Often */}
            <section id="how-often">
              <h2 className="font-serif text-2xl font-bold mb-4">How often should you sharpen</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                There is not one schedule that works for everyone. A helpful starting point is to sharpen 
                more often when:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>You skate frequently each week.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>You practice jumps, stops, or strong edges.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>You feel your edges slipping during turns.</span>
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                You may be able to go longer between sharpenings if you skate casually and mostly glide. 
                The best signal is performance. If you are working harder to do normal skills, it might be time.
              </p>
            </section>

            <Separator />

            {/* Signs You Need Sharpening */}
            <section id="signs-need">
              <h2 className="font-serif text-2xl font-bold mb-4">Signs you might need a sharpening</h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span>You feel like your skates slide out during turns.</span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span>You cannot hold an edge without wobbling.</span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span>Stopping feels inconsistent or takes more effort.</span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span>You feel unstable on one foot even on basic skills.</span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span>Your blades look shiny and rounded along the bottom.</span>
                </li>
              </ul>
            </section>

            <Separator />

            {/* Signs of Poor Sharpening */}
            <section id="signs-poor">
              <h2 className="font-serif text-2xl font-bold mb-4">Signs of a poor sharpening</h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold">×</span>
                  <span>One skate feels different than the other.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold">×</span>
                  <span>Your skates pull to one side.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold">×</span>
                  <span>The edges feel uneven.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold">×</span>
                  <span>You have sudden chatter or catching that was not there before.</span>
                </li>
              </ul>
              <div className="mt-6 bg-amber-50 dark:bg-amber-950/20 p-6 rounded-xl border border-amber-100 dark:border-amber-900/50">
                <p className="text-amber-800 dark:text-amber-300 text-sm">
                  If something feels off, do not assume it is you. It is okay to ask the sharpener to check the work.
                </p>
              </div>
            </section>

            <Separator />

            {/* What to Ask */}
            <section id="what-to-ask">
              <h2 className="font-serif text-2xl font-bold mb-4">What to ask before you sharpen</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                If you want to avoid surprises, ask these questions:
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <HelpCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Do you sharpen figure skates and hockey skates regularly?</span>
                </li>
                <li className="flex items-start gap-3">
                  <HelpCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>What ROH do you recommend for my level and style?</span>
                </li>
                <li className="flex items-start gap-3">
                  <HelpCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Can you match my last sharpening, if I liked it?</span>
                </li>
                <li className="flex items-start gap-3">
                  <HelpCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>How do you handle nicks and rocker profile?</span>
                </li>
                <li className="flex items-start gap-3">
                  <HelpCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>How long does it take, and do I need an appointment?</span>
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                If you have a coach, ask what they prefer. A consistent ROH is often more important than the perfect ROH.
              </p>
            </section>

            <Separator />

            {/* How to Find */}
            <section id="find-sharpening">
              <h2 className="font-serif text-2xl font-bold mb-4">How to find sharpening near you</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Many rinks offer sharpening through a pro shop, but not all do. Some shops only sharpen 
                hockey skates. Some sharpen both. The best approach is to:
              </p>
              <ul className="space-y-2 text-muted-foreground mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Check the rink's official website for "pro shop" or "services."</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Call ahead and ask whether they sharpen your type of skates.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Ask a coach or experienced skater where they go locally.</span>
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                If you are traveling, do not wait until your skates are unusable. Get them done before your trip if you can.
              </p>
            </section>

            <Separator />

            {/* Coming Soon */}
            <section className="bg-gradient-to-br from-primary/5 to-primary/10 p-8 rounded-2xl border">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="font-serif text-xl font-bold mb-2">Coming soon</h2>
                  <p className="text-muted-foreground">
                    We are building a directory of trusted skate sharpening options by location. 
                    If you own or operate a skate sharpening service, you will be able to claim a listing soon.
                  </p>
                </div>
              </div>
            </section>

            <Separator />

            {/* Rinks with Sharpening */}
            <section>
              <Collapsible open={showRinks} onOpenChange={setShowRinks}>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-primary" />
                    <span className="font-semibold">Rinks with sharpening services</span>
                    <Badge variant="secondary" className="ml-2">{rinksWithSharpening.length}</Badge>
                  </div>
                  <ChevronDown className={`h-5 w-5 transition-transform ${showRinks ? 'rotate-180' : ''}`} />
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-6">
                  {rinksWithSharpening.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {rinksWithSharpening.map((rink) => (
                        <RinkCard key={rink.id} rink={rink} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      No rinks with confirmed sharpening services yet.
                    </p>
                  )}
                </CollapsibleContent>
              </Collapsible>
            </section>

          </div>
        </div>
      </div>
    </Layout>
  );
}
