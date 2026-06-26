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
import { ChevronDown, Sparkles, Users, BookOpen, Clock, MapPin } from "lucide-react";
import { useState } from "react";
import { buildWebPageSchema } from "@/lib/seo";

export default function LearnToSkate() {
  const description = "Understand how Learn to Skate programs work, what to expect, and how to find beginner skating lessons near you. A practical guide for new skaters of all ages.";

  useHead({
    title: "Learn to Skate Programs",
    description,
    canonicalPath: "/services/learn-to-skate",
    structuredData: [buildWebPageSchema("/services/learn-to-skate", "Learn to Skate Programs", description)],
  });

  const [showRinks, setShowRinks] = useState(false);
  
  const rinksWithLearnToSkate = rinks.filter(r => isTruthy(r.offerings.learn_to_skate));

  const sections = [
    { id: "what-it-means", label: "What Learn to Skate usually means" },
    { id: "who-its-for", label: "Who Learn to Skate is for" },
    { id: "typical-class", label: "What a typical class looks like" },
    { id: "what-you-need", label: "What you usually need" },
    { id: "how-long", label: "How long it takes to progress" },
    { id: "paths", label: "Figure skating and hockey paths" },
    { id: "find-programs", label: "How to find programs near you" },
    { id: "questions", label: "Questions to ask before signing up" },
  ];

  return (
    <Layout>
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Learn to Skate</h1>
          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
            Learning to skate can feel intimidating at first, especially if you are not sure where to start. 
            Most rinks offer a Learn to Skate program designed to teach the basics in a safe, structured way. 
            This page explains how those programs usually work, what to expect, and how to choose the right starting point.
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
            
            {/* What Learn to Skate Means */}
            <section id="what-it-means">
              <h2 className="font-serif text-2xl font-bold mb-4">What "Learn to Skate" usually means</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Learn to Skate is a beginner program focused on building confidence on the ice. It typically covers 
                balance, basic movement, stopping, and simple turns. Classes are usually taught in small groups and 
                follow a progressive curriculum so skaters move forward at a steady pace.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Programs may be offered for children, teens, and adults. Some rinks separate age groups. 
                Others group by skill level instead.
              </p>
            </section>

            <Separator />

            {/* Who It's For */}
            <section id="who-its-for">
              <h2 className="font-serif text-2xl font-bold mb-4">Who Learn to Skate is for</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Learn to Skate programs are designed for:
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>First time skaters</span>
                </li>
                <li className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Skaters returning after a long break</span>
                </li>
                <li className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Children learning fundamentals before hockey or figure skating</span>
                </li>
                <li className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Adults who want structured instruction instead of open sessions</span>
                </li>
              </ul>
              <div className="mt-6 bg-blue-50 dark:bg-blue-950/20 p-6 rounded-xl border border-blue-100 dark:border-blue-900/50">
                <p className="text-blue-800 dark:text-blue-300 text-sm">
                  You do not need prior experience to start. Most programs assume you are new.
                </p>
              </div>
            </section>

            <Separator />

            {/* Typical Class */}
            <section id="typical-class">
              <h2 className="font-serif text-2xl font-bold mb-4">What a typical class looks like</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Most Learn to Skate programs include:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Weekly group lessons</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>A set class schedule over several weeks</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Certified instructors or trained coaches</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>A progression system with levels or badges</span>
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Some programs include practice time during public sessions. Others offer separate practice ice.
              </p>
            </section>

            <Separator />

            {/* What You Need */}
            <section id="what-you-need">
              <h2 className="font-serif text-2xl font-bold mb-4">What you usually need</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Before your first class, check what the rink requires. Most programs expect:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Skates that fit properly</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Warm, flexible clothing</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Gloves or mittens</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>A helmet for young children</span>
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Rental skates are often allowed at the beginner level, but many skaters prefer their own skates once they commit.
              </p>
            </section>

            <Separator />

            {/* How Long */}
            <section id="how-long">
              <h2 className="font-serif text-2xl font-bold mb-4">How long it takes to progress</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Progress looks different for everyone. Factors include:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Clock className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>How often you skate outside of class</span>
                </li>
                <li className="flex items-start gap-2">
                  <Clock className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Comfort level on the ice</span>
                </li>
                <li className="flex items-start gap-2">
                  <Clock className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Age and athletic background</span>
                </li>
              </ul>
              <div className="mt-6 bg-green-50 dark:bg-green-950/20 p-6 rounded-xl border border-green-100 dark:border-green-900/50">
                <p className="text-green-800 dark:text-green-300 text-sm">
                  The goal at the beginner stage is confidence, not speed. Learning solid fundamentals makes everything else easier later.
                </p>
              </div>
            </section>

            <Separator />

            {/* Figure Skating and Hockey Paths */}
            <section id="paths">
              <h2 className="font-serif text-2xl font-bold mb-4">Figure skating and hockey paths</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Many Learn to Skate programs serve as a foundation for both figure skating and hockey. 
                After completing basic levels, rinks may recommend:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <BookOpen className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>A figure skating skills program</span>
                </li>
                <li className="flex items-start gap-2">
                  <BookOpen className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Hockey development or learn to play programs</span>
                </li>
                <li className="flex items-start gap-2">
                  <BookOpen className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Private lessons for focused goals</span>
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Ask the rink or your instructor what the next step usually is.
              </p>
            </section>

            <Separator />

            {/* How to Find Programs */}
            <section id="find-programs">
              <h2 className="font-serif text-2xl font-bold mb-4">How to find Learn to Skate programs near you</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Most rinks list Learn to Skate programs on their official website under lessons, programs, or skating school. 
                A few helpful steps:
              </p>
              <ul className="space-y-2 text-muted-foreground mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Check the rink's website for class schedules</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Call the front desk or skating director</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Ask what age groups and levels are offered</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Confirm whether rental skates are included</span>
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                If the website is unclear, a quick call usually saves time.
              </p>
            </section>

            <Separator />

            {/* Questions to Ask */}
            <section id="questions">
              <h2 className="font-serif text-2xl font-bold mb-4">Questions to ask before signing up</h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Is this program suitable for complete beginners?</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Are classes grouped by age or skill?</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>What happens if I miss a class?</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Do you recommend rentals or personal skates?</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>How do skaters move to the next level?</span>
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Clear answers usually indicate a well run program.
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
                    We are building a directory of rinks and programs to help skaters easily find Learn to Skate 
                    options by location. Verified program listings will be available soon.
                  </p>
                </div>
              </div>
            </section>

            <Separator />

            {/* Rinks with Learn to Skate */}
            <section>
              <Collapsible open={showRinks} onOpenChange={setShowRinks}>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-primary" />
                    <span className="font-semibold">Rinks with Learn to Skate programs</span>
                    <Badge variant="secondary" className="ml-2">{rinksWithLearnToSkate.length}</Badge>
                  </div>
                  <ChevronDown className={`h-5 w-5 transition-transform ${showRinks ? 'rotate-180' : ''}`} />
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-6">
                  {rinksWithLearnToSkate.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {rinksWithLearnToSkate.map((rink) => (
                        <RinkCard key={rink.id} rink={rink} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      No rinks with confirmed Learn to Skate programs yet.
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
