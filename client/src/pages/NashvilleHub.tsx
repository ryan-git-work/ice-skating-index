import { Layout } from "@/components/Layout";
import { useHead } from "@/hooks/use-head";
import { rinks } from "@/lib/data";
import { RinkCard } from "@/components/RinkCard";
import { Separator } from "@/components/ui/separator";
import { Link } from "wouter";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MapPin, Star, Users, Clock, Snowflake } from "lucide-react";

export default function NashvilleHub() {
  useHead({
    title: "Ice Skating in Nashville, TN | Rinks, Lessons & Schedules",
    description: "Find ice skating in Nashville, TN. Explore rinks, public skate options, lessons, freestyle sessions, and tips for first-time skaters."
  });

  const nashvilleRinks = rinks.filter(r => 
    r.slug === "centennial-sportsplex-nashville-tn" ||
    r.slug === "ford-ice-center-bellevue-nashville-tn" ||
    r.slug === "ford-ice-center-antioch-antioch-tn"
  );

  const centennial = rinks.find(r => r.slug === "centennial-sportsplex-nashville-tn");
  const bellevue = rinks.find(r => r.slug === "ford-ice-center-bellevue-nashville-tn");
  const antioch = rinks.find(r => r.slug === "ford-ice-center-antioch-antioch-tn");

  const sections = [
    { id: "nashville-ice-rinks", label: "Nashville ice rinks" },
    { id: "best-places-to-ice-skate-in-nashville", label: "Best rinks by what you need" },
    { id: "public-skate-vs-freestyle-skate", label: "Public skate vs freestyle" },
    { id: "how-to-check-nashville-ice-skating-schedules-fast", label: "How to check schedules" },
    { id: "tips-for-your-first-time-ice-skating-in-nashville", label: "First time tips" },
    { id: "nashville-ice-skating-faq", label: "FAQ" },
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://iceskatingindex.com/tennessee/nashville-ice-skating/#webpage",
        "url": "https://iceskatingindex.com/tennessee/nashville-ice-skating/",
        "name": "Ice Skating in Nashville, TN",
        "description": "Find ice skating in Nashville, TN. Explore rinks, public skate options, lessons, freestyle sessions, and tips for first-time skaters.",
        "isPartOf": {
          "@type": "WebSite",
          "@id": "https://iceskatingindex.com/#website",
          "url": "https://iceskatingindex.com/",
          "name": "Ice Skating Index"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://iceskatingindex.com/tennessee/nashville-ice-skating/#breadcrumbs",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://iceskatingindex.com/" },
          { "@type": "ListItem", "position": 2, "name": "Tennessee", "item": "https://iceskatingindex.com/state/tn" },
          { "@type": "ListItem", "position": 3, "name": "Nashville Ice Skating", "item": "https://iceskatingindex.com/tennessee/nashville-ice-skating/" }
        ]
      },
      {
        "@type": "ItemList",
        "@id": "https://iceskatingindex.com/tennessee/nashville-ice-skating/#rinklist",
        "name": "Nashville Ice Rinks",
        "itemListOrder": "https://schema.org/ItemListUnordered",
        "numberOfItems": 3,
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Centennial Sportsplex Ice Arenas", "url": "https://iceskatingindex.com/rink/centennial-sportsplex-nashville-tn" },
          { "@type": "ListItem", "position": 2, "name": "Ford Ice Center Bellevue", "url": "https://iceskatingindex.com/rink/ford-ice-center-bellevue-nashville-tn" },
          { "@type": "ListItem", "position": 3, "name": "Ford Ice Center Antioch", "url": "https://iceskatingindex.com/rink/ford-ice-center-antioch-antioch-tn" }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": "https://iceskatingindex.com/tennessee/nashville-ice-skating/#faq",
        "mainEntity": [
          { "@type": "Question", "name": "Do I need my own skates?", "acceptedAnswer": { "@type": "Answer", "text": "No. Most public sessions offer skate rentals. Owning skates helps with comfort and consistency if you skate regularly." } },
          { "@type": "Question", "name": "Is public skate okay for beginners?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Public skate is the best starting point. Go slowly, stay aware, and use the boards when needed." } },
          { "@type": "Question", "name": "What should I wear ice skating?", "acceptedAnswer": { "@type": "Answer", "text": "Dress for cold air and movement. Wear layers, pants you can bend in, and consider gloves for beginners." } },
          { "@type": "Question", "name": "What time should I arrive?", "acceptedAnswer": { "@type": "Answer", "text": "Arrive 20 to 30 minutes early for parking, check-in, and rentals, especially on weekends." } },
          { "@type": "Question", "name": "What is freestyle ice time?", "acceptedAnswer": { "@type": "Answer", "text": "Freestyle is practice-focused ice time, often used by figure skaters. It typically has different etiquette than public skate." } },
          { "@type": "Question", "name": "Are there lessons for kids and adults?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Lessons are commonly available for both kids and adults. Start on your preferred rink page to find official program links." } }
        ]
      }
    ]
  };

  return (
    <Layout>
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      {/* Hero */}
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <Link href="/state/tn" className="hover:text-primary">Tennessee</Link>
            <span>/</span>
            <span>Nashville</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Ice Skating in Nashville, TN</h1>
          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
            If you are searching for <strong className="text-foreground">ice skating in Nashville, TN</strong>, start here. 
            This page helps you pick the right rink for <strong className="text-foreground">public skate</strong>, 
            <strong className="text-foreground"> learn-to-skate lessons</strong>, 
            <strong className="text-foreground"> freestyle figure skating practice</strong>, and 
            <strong className="text-foreground"> hockey</strong>, based on where you live and what kind of session you need.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="sticky top-8">
              <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-4">Quick Links</h2>
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

            {/* Quick Answer */}
            <section className="bg-primary/5 p-6 rounded-2xl border border-primary/10">
              <h2 className="font-serif text-xl font-bold mb-4 flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                Quick answer: Which rink is best?
              </h2>
              <ul className="space-y-4 text-muted-foreground">
                <li>
                  <strong className="text-foreground">Best overall "default" choice (most amenities):</strong>{" "}
                  <Link href="/rink/ford-ice-center-bellevue-nashville-tn" className="text-primary hover:underline">Ford Ice Center Bellevue</Link>.
                  It is a newer twin-rink facility with major on-site amenities, including a restaurant and a pro shop.
                </li>
                <li>
                  <strong className="text-foreground">Best if you want a central Nashville rink near Midtown:</strong>{" "}
                  <Link href="/rink/centennial-sportsplex-nashville-tn" className="text-primary hover:underline">Centennial Sportsplex Ice Arenas</Link>.
                  It is a long-running, central option with public skate and lessons and is home to local skating community activity.
                </li>
                <li>
                  <strong className="text-foreground">Best if you are coming from South Nashville or Antioch:</strong>{" "}
                  <Link href="/rink/ford-ice-center-antioch-antioch-tn" className="text-primary hover:underline">Ford Ice Center Antioch</Link>.
                  It is a twin-rink facility with wide program coverage.
                </li>
              </ul>
              <p className="text-sm text-muted-foreground mt-4">
                If you are not sure, choose based on geography first (Bellevue for West Nashville, Antioch for South Nashville, Centennial for Midtown and central Nashville).
              </p>
            </section>

            <Separator />

            {/* Nashville Ice Rinks */}
            <section id="nashville-ice-rinks">
              <h2 className="font-serif text-2xl font-bold mb-6">Nashville Ice Rinks</h2>
              <p className="text-muted-foreground mb-6">
                These are the Nashville-area rinks currently listed on Ice Skating Index. Each card below takes you to a dedicated rink page.
              </p>
              
              <div className="space-y-6">
                {centennial && (
                  <div className="bg-card border rounded-xl p-6">
                    <h3 className="font-serif text-xl font-bold mb-2">
                      <Link href={`/rink/${centennial.slug}`} className="hover:text-primary transition-colors">
                        Centennial Sportsplex Ice Arenas (Nashville)
                      </Link>
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      <strong className="text-foreground">Best for:</strong> central Nashville access, public skate, lessons, hockey programs, and a classic community rink environment.
                    </p>
                    <Link href={`/rink/${centennial.slug}`} className="text-primary text-sm hover:underline flex items-center gap-1">
                      <MapPin className="h-4 w-4" /> View rink details
                    </Link>
                  </div>
                )}
                
                {bellevue && (
                  <div className="bg-card border rounded-xl p-6">
                    <h3 className="font-serif text-xl font-bold mb-2">
                      <Link href={`/rink/${bellevue.slug}`} className="hover:text-primary transition-colors">
                        Ford Ice Center Bellevue (Nashville)
                      </Link>
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      <strong className="text-foreground">Best for:</strong> a modern facility experience, strong on-site amenities, and a wide mix of public skating, figure skating, and hockey activity.
                    </p>
                    <Link href={`/rink/${bellevue.slug}`} className="text-primary text-sm hover:underline flex items-center gap-1">
                      <MapPin className="h-4 w-4" /> View rink details
                    </Link>
                  </div>
                )}
                
                {antioch && (
                  <div className="bg-card border rounded-xl p-6">
                    <h3 className="font-serif text-xl font-bold mb-2">
                      <Link href={`/rink/${antioch.slug}`} className="hover:text-primary transition-colors">
                        Ford Ice Center Antioch (Antioch, TN)
                      </Link>
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      <strong className="text-foreground">Best for:</strong> South Nashville access, broad programming coverage, and year-round skating options in the Antioch area.
                    </p>
                    <Link href={`/rink/${antioch.slug}`} className="text-primary text-sm hover:underline flex items-center gap-1">
                      <MapPin className="h-4 w-4" /> View rink details
                    </Link>
                  </div>
                )}
              </div>
            </section>

            <Separator />

            {/* Best Places */}
            <section id="best-places-to-ice-skate-in-nashville">
              <h2 className="font-serif text-2xl font-bold mb-6">Best Places to Ice Skate in Nashville</h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Best overall rink for most people</h3>
                  <p className="text-muted-foreground">
                    If you want one rink to start with and you are not sure what you need yet, <Link href="/rink/ford-ice-center-bellevue-nashville-tn" className="text-primary hover:underline">Ford Ice Center Bellevue</Link> is the best overall default. It is a newer twin-rink facility and is built to handle a lot of programming, events, and visitors.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Best for central Nashville and Midtown</h3>
                  <p className="text-muted-foreground">
                    If you want a rink in a central location, <Link href="/rink/centennial-sportsplex-nashville-tn" className="text-primary hover:underline">Centennial Sportsplex Ice Arenas</Link> is the best answer.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Best for South Nashville and Antioch</h3>
                  <p className="text-muted-foreground">
                    If you live south of the city or want to avoid crossing town, <Link href="/rink/ford-ice-center-antioch-antioch-tn" className="text-primary hover:underline">Ford Ice Center Antioch</Link> is the best answer.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Best for beginners</h3>
                  <p className="text-muted-foreground mb-4">
                    For your first time on the ice, pick a rink that makes it easy to find public skate and get fitted for rentals. All three rinks offer strong options, so choose the closest rink first, then aim for a less crowded session time.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {nashvilleRinks.map(rink => (
                      <RinkCard key={rink.id} rink={rink} />
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Best for kids and families</h3>
                  <p className="text-muted-foreground">
                    If you are bringing kids, <Link href="/rink/ford-ice-center-bellevue-nashville-tn" className="text-primary hover:underline">Ford Ice Center Bellevue</Link> is the best family default because the facility is built with major on-site amenities. If Centennial or Antioch is closer to you, choose proximity first so the day stays smooth.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Best for figure skating practice</h3>
                  <p className="text-muted-foreground">
                    If you are practicing edges, spins, or choreography, look for <Link href="/freestyle" className="text-primary hover:underline">freestyle sessions</Link> rather than public skate. For dedicated freestyle options, the Ford Ice Centers are a strong starting point. Centennial is also a major home base for the local figure skating community.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Best for hockey</h3>
                  <p className="text-muted-foreground">
                    All three rinks support hockey activity. If you care most about hockey infrastructure and facility scale, <Link href="/rink/ford-ice-center-bellevue-nashville-tn" className="text-primary hover:underline">Ford Ice Center Bellevue</Link> is the strongest default. Centennial is also a long-running hub for open hockey and leagues.
                  </p>
                </div>
              </div>
            </section>

            <Separator />

            {/* Public Skate vs Freestyle */}
            <section id="public-skate-vs-freestyle-skate">
              <h2 className="font-serif text-2xl font-bold mb-6">Public Skate vs Freestyle Skate</h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-primary/5 p-6 rounded-xl border">
                  <h3 className="font-semibold mb-3 text-primary">Public Skate</h3>
                  <p className="text-sm text-muted-foreground">
                    General skating time for everyone. It is the right fit for date nights, families, and first-time skaters. The goal is simple: skate safely, have fun, and build confidence.
                  </p>
                </div>
                <div className="bg-muted/50 p-6 rounded-xl border">
                  <h3 className="font-semibold mb-3">Freestyle</h3>
                  <p className="text-sm text-muted-foreground">
                    Practice-oriented ice time, typically used by figure skaters and advanced skaters working on specific skills. Freestyle sessions usually have stricter etiquette so skaters can train without collisions.
                  </p>
                </div>
              </div>
              
              <p className="text-muted-foreground">
                If you are not sure, start with public skate. Once you can control speed and stop confidently, <Link href="/freestyle" className="text-primary hover:underline">freestyle</Link> becomes a great next step.
              </p>
            </section>

            <Separator />

            {/* Schedules */}
            <section id="how-to-check-nashville-ice-skating-schedules-fast">
              <h2 className="font-serif text-2xl font-bold mb-6">How to Check Nashville Ice Skating Schedules Fast</h2>
              <p className="text-muted-foreground mb-4">
                Schedules change often due to lessons, games, events, and private rentals. Here is the fastest way to confirm the right session before you drive.
              </p>
              <ol className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">1</span>
                  <span>Start on the rink's page here on Ice Skating Index.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">2</span>
                  <span>Use the official schedule and registration links on that rink page.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">3</span>
                  <span>Look for the specific session type you want (public skate, freestyle, lessons, hockey).</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">4</span>
                  <span>Check for holiday updates or special event notes.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">5</span>
                  <span>Arrive 20 to 30 minutes early for rentals and check-in, especially on weekends.</span>
                </li>
              </ol>
            </section>

            <Separator />

            {/* First Time Tips */}
            <section id="tips-for-your-first-time-ice-skating-in-nashville">
              <h2 className="font-serif text-2xl font-bold mb-6">Tips for Your First Time Ice Skating in Nashville</h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <Snowflake className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Wear warm layers and comfortable socks that are not too thin and not overly thick.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Snowflake className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Choose a quieter session if possible, since crowded ice can feel intimidating.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Snowflake className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Start near the boards, then gradually move to open ice as you stabilize.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Snowflake className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Learn two skills first: gliding and stopping. Everything improves after that.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Snowflake className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Expect a small fall or two. Try to fall to the side and move to the boards before standing.</span>
                </li>
              </ul>
            </section>

            <Separator />

            {/* FAQ */}
            <section id="nashville-ice-skating-faq">
              <h2 className="font-serif text-2xl font-bold mb-6">Nashville Ice Skating FAQ</h2>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="skates">
                  <AccordionTrigger>Do I need my own skates?</AccordionTrigger>
                  <AccordionContent>
                    No. Most public sessions offer skate rentals. Owning skates helps with comfort and consistency if you skate regularly.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="beginners">
                  <AccordionTrigger>Is public skate okay for beginners?</AccordionTrigger>
                  <AccordionContent>
                    Yes. Public skate is the best starting point. Just go slowly, stay aware, and use the boards when needed.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="wear">
                  <AccordionTrigger>What should I wear ice skating?</AccordionTrigger>
                  <AccordionContent>
                    Dress for cold air and movement. Wear layers and pants you can bend in. Gloves are a good idea for beginners.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="arrive">
                  <AccordionTrigger>What time should I arrive?</AccordionTrigger>
                  <AccordionContent>
                    Plan to arrive 20 to 30 minutes early so you have time for parking, check-in, and rentals.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="freestyle">
                  <AccordionTrigger>What is freestyle ice time?</AccordionTrigger>
                  <AccordionContent>
                    Freestyle is practice-focused ice time, often used by figure skaters. It typically has different etiquette than public skate. <Link href="/freestyle" className="text-primary hover:underline">Learn more about freestyle sessions</Link>.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="lessons">
                  <AccordionTrigger>Are there lessons for kids and adults?</AccordionTrigger>
                  <AccordionContent>
                    Yes. Lessons are commonly available for both kids and adults. Start on your preferred rink page to find the official program links. <Link href="/services/learn-to-skate" className="text-primary hover:underline">Learn more about Learn to Skate programs</Link>.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

          </div>
        </div>
      </div>
    </Layout>
  );
}
