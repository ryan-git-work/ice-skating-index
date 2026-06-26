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
import { ChevronDown, Sparkles, Users, Eye, CheckCircle, HelpCircle, MapPin } from "lucide-react";
import { useState } from "react";
import { buildWebPageSchema } from "@/lib/seo";

export default function FreestyleHub() {
  const description = "Learn what freestyle sessions are, who they are for, and how they differ from public skate. A complete guide to freestyle ice for figure skaters.";

  useHead({
    title: "Freestyle Sessions | What is Freestyle Ice Skating",
    description,
    canonicalPath: "/freestyle",
    structuredData: [buildWebPageSchema("/freestyle", "Freestyle Sessions", description)],
  });

  const [showRinks, setShowRinks] = useState(false);
  
  const freestyleRinks = rinks.filter(r => isTruthy(r.freestyle?.available));

  const sections = [
    { id: "what-is-freestyle", label: "What is a freestyle session" },
    { id: "who-its-for", label: "Who freestyle sessions are for" },
    { id: "vs-public-skate", label: "Freestyle sessions vs public skate" },
    { id: "typical-session", label: "What a typical session looks like" },
    { id: "etiquette", label: "Etiquette and expectations" },
    { id: "what-you-need", label: "What you usually need" },
    { id: "requirements", label: "Common requirements and level expectations" },
    { id: "questions", label: "Questions to ask before you go" },
    { id: "find-sessions", label: "How to find freestyle sessions near you" },
  ];

  return (
    <Layout>
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Freestyle Sessions</h1>
          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
            Freestyle sessions are dedicated ice times designed for skill development, focused practice, and coaching. 
            They are different from public skate because the purpose is training, not general recreation. This page explains 
            what freestyle ice is, who it is for, how it usually works, and what to expect when you show up.
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
            
            {/* What is a Freestyle Session */}
            <section id="what-is-freestyle">
              <h2 className="font-serif text-2xl font-bold mb-4">What is a freestyle session</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                A freestyle session is a scheduled practice time where skaters work on skills like edges, turns, jumps, 
                spins, footwork, and program run-throughs. Many rinks allow private lessons during freestyle sessions, 
                and the ice is typically shared by multiple skaters training at the same time.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Freestyle ice is usually quieter and more structured than public skate. Skaters are expected to be aware 
                of their surroundings and follow basic right-of-way rules so everyone can practice safely.
              </p>
            </section>

            <Separator />

            {/* Who Freestyle Sessions Are For */}
            <section id="who-its-for">
              <h2 className="font-serif text-2xl font-bold mb-4">Who freestyle sessions are for</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Freestyle sessions are a good fit for:
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Figure skaters practicing skills, programs, spins, or jumps.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Skaters taking private lessons with a coach.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Competitive skaters preparing for tests or competitions.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Skaters who want focused ice time without heavy public traffic.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Hockey players practicing edge work or power skating if the rink allows it.</span>
                </li>
              </ul>
              <div className="mt-6 bg-blue-50 dark:bg-blue-950/20 p-6 rounded-xl border border-blue-100 dark:border-blue-900/50">
                <p className="text-blue-800 dark:text-blue-300 text-sm">
                  If you are brand new to skating, a Learn to Skate program is usually the better place to start. 
                  Freestyle can still be welcoming for beginners, but it works best when you already have basic control 
                  and can skate predictably.
                </p>
              </div>
            </section>

            <Separator />

            {/* Freestyle vs Public Skate */}
            <section id="vs-public-skate">
              <h2 className="font-serif text-2xl font-bold mb-4">Freestyle sessions vs public skate</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Freestyle sessions and public skate can look similar from a distance, but they function very differently.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-primary/5 p-6 rounded-xl border">
                  <h3 className="font-semibold mb-3 text-primary">Freestyle sessions</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Focus on training and skill development.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Often allow coaching and private lessons.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>May include skaters jumping, spinning, or running programs.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Expect predictable skating patterns and awareness.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Usually have lower crowd density than public skate.</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-muted/50 p-6 rounded-xl border">
                  <h3 className="font-semibold mb-3">Public skate</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="mt-1">•</span>
                      <span>Focuses on recreational skating and family fun.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1">•</span>
                      <span>Usually does not allow coaching or structured lessons.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1">•</span>
                      <span>Has more beginners and less predictable movement.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1">•</span>
                      <span>Is better for casual laps and confidence building.</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <p className="text-muted-foreground leading-relaxed mt-6">
                If you need space to work on skills, freestyle is often the right choice. If you want a relaxed skate 
                with friends or family, public skate is usually the better fit.
              </p>
            </section>

            <Separator />

            {/* What a Typical Session Looks Like */}
            <section id="typical-session">
              <h2 className="font-serif text-2xl font-bold mb-4">What a freestyle session typically looks like</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Most freestyle sessions have:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>A scheduled start and end time.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>A mix of skaters practicing different skills at once.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Coaches teaching lessons at the boards or in open areas.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Music playing for skaters running programs at some rinks.</span>
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Some rinks separate sessions by level, such as beginner freestyle, intermediate freestyle, or advanced 
                freestyle. Others run one general session and expect skaters to self-manage using basic etiquette.
              </p>
            </section>

            <Separator />

            {/* Etiquette and Expectations */}
            <section id="etiquette">
              <h2 className="font-serif text-2xl font-bold mb-4">Etiquette and expectations</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Freestyle runs best when everyone shares the ice well. A few common expectations:
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <Eye className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Look before you start any element, especially jumps and spins.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Eye className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Do not cut directly through other skaters' patterns.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Eye className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Give space to skaters running full programs.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Eye className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Keep moving if you are in the middle of the ice.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Eye className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Step to the side near the boards if you need to stop and talk.</span>
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                If you are unsure, ask a coach or experienced skater what is normal at that rink. Every rink has a 
                slightly different culture, but safety and awareness are always valued.
              </p>
            </section>

            <Separator />

            {/* What You Usually Need */}
            <section id="what-you-need">
              <h2 className="font-serif text-2xl font-bold mb-4">What you usually need</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                A good freestyle session starts with the basics:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Skates that fit well and are sharpened appropriately.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Gloves or mittens, especially for newer skaters.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Warm layers that allow movement.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Hair tied back, and no loose items that can fall on the ice.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Basic protective gear if you are learning jumps or feel more confident with protection.</span>
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                If you are working with a coach, they may recommend specific off-ice warmups, guards, or training accessories.
              </p>
            </section>

            <Separator />

            {/* Common Requirements and Level Expectations */}
            <section id="requirements">
              <h2 className="font-serif text-2xl font-bold mb-4">Common requirements and level expectations</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Freestyle requirements vary by rink. Some rinks allow anyone who can skate confidently. Others require:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Completion of certain Learn to Skate levels.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Coach approval.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>A membership or freestyle pass.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Proof of testing level for advanced sessions.</span>
                </li>
              </ul>
              <div className="mt-6 bg-amber-50 dark:bg-amber-950/20 p-6 rounded-xl border border-amber-100 dark:border-amber-900/50">
                <p className="text-amber-800 dark:text-amber-300 text-sm">
                  When in doubt, call the rink and ask what level is recommended. Clear requirements usually mean the 
                  session will feel safer and more organized.
                </p>
              </div>
            </section>

            <Separator />

            {/* Questions to Ask */}
            <section id="questions">
              <h2 className="font-serif text-2xl font-bold mb-4">Questions to ask before you go</h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <HelpCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Is this freestyle session for figure skating, hockey, or both?</span>
                </li>
                <li className="flex items-start gap-3">
                  <HelpCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Are private lessons allowed during this session?</span>
                </li>
                <li className="flex items-start gap-3">
                  <HelpCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Is there a minimum level required to participate?</span>
                </li>
                <li className="flex items-start gap-3">
                  <HelpCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Is music used for program run-throughs?</span>
                </li>
                <li className="flex items-start gap-3">
                  <HelpCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>How busy is this session usually?</span>
                </li>
                <li className="flex items-start gap-3">
                  <HelpCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Are there separate sessions for different levels?</span>
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                These questions help you choose the right ice time and avoid showing up to a session that is not the right fit.
              </p>
            </section>

            <Separator />

            {/* How to Find Freestyle Sessions */}
            <section id="find-sessions">
              <h2 className="font-serif text-2xl font-bold mb-4">How to find freestyle sessions near you</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Most rinks list freestyle sessions under figure skating, skating school, programs, or ice schedules. 
                A helpful approach:
              </p>
              <ul className="space-y-2 text-muted-foreground mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Check the rink's official website for ice schedules or figure skating pages.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Call the front desk or skating director to confirm session details.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Ask a coach or experienced skater which sessions are best for your level.</span>
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                If the schedule is unclear online, a short call usually gives the fastest answer.
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
                    We are building a directory of freestyle sessions and freestyle friendly rinks by location. 
                    Verified listings will be added over time so you can find sessions that match your level, goals, and schedule.
                  </p>
                </div>
              </div>
            </section>

            <Separator />

            {/* Rinks with Freestyle */}
            <section>
              <Collapsible open={showRinks} onOpenChange={setShowRinks}>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-primary" />
                    <span className="font-semibold">Rinks with freestyle sessions</span>
                    <Badge variant="secondary" className="ml-2">{freestyleRinks.length}</Badge>
                  </div>
                  <ChevronDown className={`h-5 w-5 transition-transform ${showRinks ? 'rotate-180' : ''}`} />
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-6">
                  {freestyleRinks.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {freestyleRinks.map((rink) => (
                        <RinkCard key={rink.id} rink={rink} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      No rinks with confirmed freestyle sessions yet.
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
